import { 
    BadRequestException, 
    ConflictException, 
    Injectable, 
    NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { 
    CreateClassDTO, 
    CreateFiliereDTO, 
    CreateYearDTO, 
    createGroupDto, 
    createCourseDto, 
    addStudentsToCourseDTO} from './dto';
import { parseCSV } from 'src/utils';

@Injectable()
export class AdminService {
    constructor(
        private prismaService: PrismaService
    ){}

    async createFiliere(createFiliereDto: CreateFiliereDTO, user: any) {
        // récupère l'id de l'école a partir du token (request.user.schoolId)
        const schoolId = user.schoolId;
        console.log(schoolId);

        const existingFiliere = await this.prismaService.filiere.findFirst({
            where: {
              name: createFiliereDto.name,
              schoolId: schoolId
            }
          });
          
          if (existingFiliere) throw new ConflictException("Une filière avec ce nom existe déjà pour cette école.");
          
        
        // la filière appartiens a l'école de l'admin qui appelle cette route
        return this.prismaService.filiere.create({
            data: {
                name: createFiliereDto.name,
                School: {
                    connect: {
                        id: schoolId
                    }
                }
            }
        })
    }

    async createYear(createYearDTO: CreateYearDTO, user: any) {
        // récupère l'id de l'école a partir du token (request.user.schoolId)
        const schoolId = user.schoolId;
        // je retrouve la filière a laquelle appartiendra l'année en question
        const filiere = await this.prismaService.filiere.findFirst({
            where: {
                id: createYearDTO.filiereId,
                schoolId: schoolId
            }
        });
        if (!filiere) throw new NotFoundException('Filiere not found');
        // je vérifie que l'année n'existe pas déjà pour cette filière
        const existingYear = await this.prismaService.year.findFirst({
            where: {
                year: createYearDTO.year,
                filiereId: createYearDTO.filiereId
            }
        });
        if (existingYear) throw new ConflictException("L'année existe déjà pour cette filière.");
        // création de l'année
        return this.prismaService.year.create({
            data: {
                year: createYearDTO.year,
                Filiere: {
                    connect: {
                        id: createYearDTO.filiereId
                    }
                }
            }
        })
    }

    async createClass(createClassDTO: CreateClassDTO, user: any) {
        // récupère l'id de l'école a partir du token (request.user.schoolId)
        const schoolId = user.schoolId;

        // je retrouve l'année a laquelle appartiendra la classe en question
        const year = await this.prismaService.year.findFirst({
            where: {
                id: createClassDTO.yearId,
                Filiere: {
                    schoolId: schoolId
                }
            }
        });
        if (!year) throw new NotFoundException('Year not found');

        // je vérifie que la classe n'existe pas déjà pour cette année
        const existingClass = await this.prismaService.classe.findFirst({
            where: {
                name: createClassDTO.name,
                yearId: createClassDTO.yearId
            }
        })
        
        if (existingClass) throw new ConflictException("La classe existe déjà pour cette année.");

        // création de la classe
        return this.prismaService.classe.create({
            data: {
                name: createClassDTO.name,
                Year: {
                    connect: {
                        id: createClassDTO.yearId
                    }
                }
            }
        });
        
    }

    async createGroup(createGroupDTO: createGroupDto, user: any) {
        const schoolId = user.schoolId;
    
        const classe = await this.prismaService.classe.findFirst({
            where: {
                id: createGroupDTO.classId,
            },
            include: {
                Year: true
            }
        });
        if (!classe) throw new NotFoundException('Class not found');
        if (classe.yearId !== createGroupDTO.yearId) {
            throw new BadRequestException('The specified class does not belong to the provided year.');
        }
    
        const existingGroup = await this.prismaService.groupe.findFirst({
            where: {
                name: createGroupDTO.name,
                classeId: createGroupDTO.classId,
                yearId: createGroupDTO.yearId
            }
        });
        if (existingGroup) throw new ConflictException("Le groupe existe déjà pour cette classe et cette année.");
    
        return this.prismaService.groupe.create({
            data: {
                name: createGroupDTO.name,
                classeId: createGroupDTO.classId,
                Year: {
                    connect: {
                        id: createGroupDTO.yearId
                    }
                }
            }
        })
    }

    async createCourse(createCourseDto: createCourseDto, request: any) {
        const schoolId = request.user.schoolId;
        
        const startTime = new Date(createCourseDto.startingTime);
        const endTime = new Date(startTime);
        endTime.setHours(endTime.getHours() + createCourseDto.duration);
    
        return this.prismaService.course.create({
            data: {
                name: createCourseDto.name,
                teacherId: createCourseDto.teacherId,
                startTime: startTime,
                endTime: endTime,
                duration: createCourseDto.duration,
                Groupe: {
                    connect: {
                        id: createCourseDto.groupId
                    }
                },
                School: {
                    connect: {
                        id: schoolId
                    }
                }
            }
        });
    }
    async addGroupeToCourse(courseId: string, addStudentsDto: addStudentsToCourseDTO) {
        const course = await this.prismaService.course.findUnique({
            where: { id: courseId },
        });

        if (!course) throw new NotFoundException(`Course with id ${courseId} not found`);
        
        // Vérifier si le groupeId du cours est le même que celui fourni dans addStudentsDto
        if (course.groupeId !== addStudentsDto.groupId) throw new BadRequestException('The groupId provided does not match the course groupId.');

        // S'assurez que les étudiants ajoutés appartiennent au même groupe que le cours
        const students = await this.prismaService.user.findMany({
            where: { groupeId: addStudentsDto.groupId },
        });

        const updatedStudentIds = students.map((student) => student.id);

        return this.prismaService.course.update({
            where: { id: courseId },
            data: {
                studentsIds: { set: updatedStudentIds },
            },
        });
    }

    async addStudentsToClassAndGroup(classId: string, file: Express.Multer.File) {
        const students = await parseCSV(file.buffer.toString());
        const studentsIds = [];
        const notFoundEmails = [];
    
        // Chercher la classe pour obtenir le yearId
        const targetClass = await this.prismaService.classe.findFirst({
            where: { id: classId }
        });
        if (!targetClass) {
            console.error(`Classe with ID ${classId} not found.`);
            return;
        }
        const targetYearId = targetClass.yearId;
    
        for (const student of students) {
            const user = await this.prismaService.user.findFirst({
                where: { email: student.email }
            });
    
            if (!user) {
                notFoundEmails.push(student.email);
                continue;
            }
    
            const targetGroupe = await this.prismaService.groupe.findFirst({
                where: { 
                    name: student.groupe, // Assumant que le groupe est identifié par son nom
                    yearId: targetYearId  // Vérification supplémentaire
                }
            });
    
            if (!targetGroupe) {
                console.warn(`Groupe ${student.groupe} not found or not in the specified class for email: ${student.email}`);
                continue;
            }
    
            studentsIds.push(user.id);
    
            await this.prismaService.user.update({
                where: { id: user.id },
                data: { 
                    classeId: classId,
                    groupeId: targetGroupe.id 
                }
            });
        }
    }
}
