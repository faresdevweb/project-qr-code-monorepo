import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateClassDTO, CreateFiliereDTO, CreateYearDTO, createGroupDto } from './dto';

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
}
