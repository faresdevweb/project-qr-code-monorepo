import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import * as argon from 'argon2';
import { signInDTO, maintenanceAccountDTO, createSchoolDTO, createAdminDTO } from './dto';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private config: ConfigService,
        private jwt: JwtService
    ){}

    async signin(signInDTO: signInDTO) {
        // vérifie que l'utilisateur existe
        const user = await this.prisma.user.findUnique({
            where: {
                email: signInDTO.email
            }
        })

        if(!user) throw new ForbiddenException("User does not exist");

        // vérifie que le mot de passe est correct
        const passwordValid = await argon.verify(user.hashPassword, signInDTO.password);

        if(!passwordValid) throw new ForbiddenException("Password is incorrect");

        // retourne l'utilisateur (avec son JWT)
        return this.signJWT(user)
    }
    
    async signJWT(user: any): Promise<{ access_token: string }> {
        let payload: any = {
            sub: user.id,
            role: user.role,
            email: user.email
        };
    
        if (['ADMIN', 'TEACHER', 'STUDENT'].includes(user.role)) {
            
            if (!user.schoolId) {
                throw new BadRequestException('User does not have a school ID');
            }
            const school = await this.prisma.school.findUnique({
                where: { id: user.schoolId }
            });
            payload = {
                ...payload,
                schoolId: school.id,
                schoolCustomId: school.customId
            };
        }
    
        const secret = this.config.get('JWT_SECRET');
        const token = await this.jwt.signAsync(payload, {
            expiresIn: '1d',
            secret: secret,
        });
    
        return {
            access_token: token,
        };
    }

    async createMaintenanceAccount(maintenanceAccountDTO: maintenanceAccountDTO){
        // hash password
        const hashedPassword = await argon.hash(maintenanceAccountDTO.password)
        try {
            // save maintenance user to db
            const maintenanceUser = await this.prisma.user.create({
                data: {
                    email: maintenanceAccountDTO.email,
                    hashPassword: hashedPassword,
                    role: "MAINTENANCE"
                }
            })
            // return token JWT
            return this.signJWT(maintenanceUser)
        } catch (error) {
            if(error instanceof PrismaClientKnownRequestError){
                if(error.code === "P2002"){
                    throw new ForbiddenException("Email already exists")
                }
            }
            throw new ForbiddenException("Cannot create maintenance account", error)
        }
    }

    async createSchool(createSchoolDto: createSchoolDTO) {
        // vérifie qu'une école avec le même nom ou schoolId n'existe pas déjà
        const schoolExists = await this.prisma.school.findFirst({
            where: { 
                    name: createSchoolDto.name 
                }, 
            });
        if (schoolExists) {
            throw new ForbiddenException("School already exists")
        }

        // crée une école avec le nom et schoolId spécifiés
        const school = await this.prisma.school.create({
            data: {
                name: createSchoolDto.name,
                customId: createSchoolDto.schoolId
            }
        })
        // retourne l'école créée
        return school
    }

    async createAdmin(createAdminDto: createAdminDTO) {
        // hash le mot de passe
        const hashedPassword = await argon.hash(createAdminDto.password)
        // vérifié que l'école pour cette admin existe
        const school = await this.prisma.school.findFirst({
            where: {
                customId: createAdminDto.schoolCustomId
            }
        })

        if(!school) throw new ForbiddenException("School does not exist")

        // crée un admin avec l'email, le mot de passe et l'école spécifiés
        const admin = await this.prisma.user.create({
            data: {
                email: createAdminDto.email,
                hashPassword: hashedPassword,
                role: "ADMIN",
                School: {
                    connect: {
                        id: school.id
                    }
                }
            } as any // Cast to any to avoid type error
        })

        // retourne l'admin créé (avec son JWT)
        return this.signJWT(admin)
    }

}
