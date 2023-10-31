import { Body, Controller, Get, Param, Put, UseGuards, Request, Post } from '@nestjs/common';
import { JwtGuard, RolesGuard } from 'src/auth/guard';
import { Roles } from 'src/decorators';
import { TeacherService } from './teacher.service';

@Controller('teacher')
export class TeacherController {
    constructor(
        private readonly teacherService: TeacherService
    ){}

    @Get('getCourses')
    @UseGuards(JwtGuard, RolesGuard)
    @Roles('TEACHER')
    getCoursesForTeacher(@Request() req: any) {
        // Utilisez l'ID de l'enseignant à partir du token JWT ou de la requête.
        return this.teacherService.getCoursesForTeacher(req);
    }

    @Put(':courseId/start')
    @UseGuards(JwtGuard, RolesGuard)
    @Roles('TEACHER')
    startCourse(@Param('courseId') courseId: string) {
      return this.teacherService.startCourse(courseId);
    }
}
