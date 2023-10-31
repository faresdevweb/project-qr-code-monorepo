import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as jwt from 'jsonwebtoken';
import * as qrcode from 'qrcode';

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
}
