import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import * as argon from 'argon2';
import { signInDTO, maintenanceAccountDTO } from './dto';
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
}
