import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import * as argon from 'argon2';
import { signInDTO, maintenanceAccountDTO, createSchoolDTO, createAdminDTO } from './dto';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { generatePassword, parseCSV, writeToFile } from 'src/utils';

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

    async createStudent( 
        file: Express.Multer.File,
        req: any
    ) {
        console.log(req);
        
        const students = await parseCSV(file.buffer.toString())

        for (let student of students) {
            const randomPassword = generatePassword(3);
            student.password = randomPassword
            const hashedPassword = await argon.hash(randomPassword);
            student.hashedPassword = hashedPassword;

             // Vérification de l'existence de la filière
             const existingFiliere = await this.prisma.filiere.findFirst({
                where: { name: student.filiereName }
            });
            if (existingFiliere) {
                student.filiereId = existingFiliere.id;
            } else {
                throw new BadRequestException(`La filière avec le nom ${student.filiereName} n'existe pas.`);
            }
            // Vérification de l'existence de l'année
            const existingYear = await this.prisma.year.findFirst({
                where: { year: student.year }
            });
            if (existingYear) {
                student.yearId = existingYear.id;
            } else {
                throw new BadRequestException(`L'année ${student.year} n'existe pas.`);
            }
        }

        writeToFile('output-student.csv', students);

        for (let student of students) {
            const existingUser = await this.prisma.user.findFirst({
                where: { email: student.email }
            });
        
            if (existingUser) {
                throw new BadRequestException(`Un utilisateur avec l'email ${student.email} existe déjà.`);
            }
        
            await this.prisma.user.create({
                data: {
                    email: student.email,
                    hashPassword: student.hashedPassword,
                    firstName: student.firstName,
                    lastName: student.lastName,
                    filiereId: student.filiereId,
                    yearId: student.yearId,
                    schoolId: req.schoolId,
                    role: 'STUDENT'
                }
            });
        }

        return students;
    }

    async createTeacher(
        file: Express.Multer.File,
        req: any
    ){
        console.log(req.user.schoolId);
        
        const teachers = await parseCSV(file.buffer.toString());
        
        for (let teacher of teachers) {
            const randomPassword = generatePassword(3);
            teacher.password = randomPassword
            const hashedPassword = await argon.hash(randomPassword);
            teacher.hashedPassword = hashedPassword;
        }

        writeToFile('output-teacher.csv', teachers);

        for (let teacher of teachers) {
            const existingUser = await this.prisma.user.findFirst({
                where: { email: teacher.email }
            });
        
            if (existingUser) {
                throw new BadRequestException(`Un utilisateur avec l'email ${teacher.email} existe déjà.`);
            }
        
            await this.prisma.user.create({
                data: {
                    email: teacher.email,
                    hashPassword: teacher.hashedPassword,
                    firstName: teacher.firstName,
                    lastName: teacher.lastName,
                    schoolId: req.user.schoolId,
                    role: 'TEACHER'
                }
            });
        }
        
        return teachers;
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
}
