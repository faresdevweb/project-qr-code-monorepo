import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFiliereDTO, CreateYearDTO } from './dto';

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
}
