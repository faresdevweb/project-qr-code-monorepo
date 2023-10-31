import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFiliereDTO } from './dto';

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
}
