import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as jwt from 'jsonwebtoken';
import * as qrcode from 'qrcode';
import { ReportIssueDto } from './dto/reportIssue.dto';

@Injectable()
export class TeacherService {
    constructor(
        private readonly prismaService: PrismaService
    ){}

    async getCoursesForTeacher(user: any) {
        const teacherId = user.id;
        return this.prismaService.course.findMany({
            where: {
                teacherId: teacherId
            },
        });
    }

    async startCourse(courseId: string) {
        return this.prismaService.course.update({
            where: { id: courseId },
            data: { started: true }
        });
    }

    async generateQrCode(courseId: string): Promise<string> {
        // Générer un JWT avec l'ID du cours et un timestamp d'expiration
        const tokenPayload = {
            courseId: courseId,
            exp: Math.floor(Date.now() / 1000) + 10  // Expiration après 10 secondes
        };
    
        const token = jwt.sign(tokenPayload, 'YOUR_SECRET_KEY');
    
        // Générer le QR Code à partir du token
        const qrCodeImage = await qrcode.toDataURL(token);
    
        return qrCodeImage;
    }

    async reportIssue(courseId: string, reportDto: ReportIssueDto) {
        // Ajouter les détails du problème au cours
        const course = this.prismaService.course.findUnique({
            where: {
                id: courseId
            }
        })
        if (!course) throw new Error('Course not found');

        return this.prismaService.course.update({
            where: {
                id: courseId
            },
            data: {
                reportIssues: {
                    create: {
                        message: reportDto.description
                    }
                }
            }
        })
    }
}
