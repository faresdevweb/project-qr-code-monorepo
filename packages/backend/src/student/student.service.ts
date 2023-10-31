import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import * as jwt from 'jsonwebtoken';
import { Course } from "@prisma/client";

@Injectable()
export class StudentService {
    constructor(
        private prismaService: PrismaService
    ){}

    async signInWithQr(courseId: string, studentId: string, token: string) {
    
        let decodedToken: any;
        try {
            decodedToken = jwt.verify(token, 'YOUR_SECRET_KEY');
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                throw new ForbiddenException('QR Code has expired.');
            }
            throw new ForbiddenException('Invalid QR Code.');
        }
    
        // Vérifie que le token correspond bien au cours
        if (decodedToken.courseId !== courseId) throw new ForbiddenException('Invalid QR Code for this course.');
    
        // Vérifie que le cours existe et qu'il a bien démarré
        const course = await this.prismaService.course.findUnique({
            where: { id: courseId },
            select: { started: true, signedInStudents: true, groupeId: true,studentsIds: true }
        });
    
        if (!course) throw new NotFoundException('Course not found');
        if (!course.started) throw new ForbiddenException('Course not started');
        console.log('Signed in students:', course.signedInStudents);
        console.log('Current student ID:', studentId);
        if (course.signedInStudents.includes(studentId)) throw new ForbiddenException('Student already signed in');
    
        // Vérifie que l'étudiant existe et récupère son classeId
        const student = await this.prismaService.user.findUnique({
            where: { id: studentId },
            select: { id: true, classeId: true }
        });
    
        if (!student) throw new NotFoundException('Student not found');
    
        // Vérifie que la classeId de l'étudiant correspond à celle du cours
        if (!course.studentsIds.includes(studentId)) throw new ForbiddenException("L'étudiant n'est pas attendu à ce cours");
    
        // Ajoute l'étudiant à la liste des étudiants ayant signé
        return this.prismaService.course.update({
            where: { id: courseId },
            data: {
                signedInStudents: {
                    push: studentId
                }
            }
        });
    }
}
