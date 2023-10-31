import { Body, Controller, Get, Param, Put, UseGuards, Request, Post } from '@nestjs/common';
import { JwtGuard, RolesGuard } from 'src/auth/guard';
import { Roles } from 'src/decorators';
import { TeacherService } from './teacher.service';
import { ReportIssueDto } from './dto/reportIssue.dto';

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

    @Get(':courseId/generate-qr')
    @UseGuards(JwtGuard, RolesGuard)
    @Roles('TEACHER')
    generateQrCode(@Param('courseId') courseId: string) {
        return this.teacherService.generateQrCode(courseId);
    }

    @Post(':courseId/report-issue')
    @UseGuards(JwtGuard, RolesGuard)
    @Roles('TEACHER')
    reportIssue(@Param('courseId') courseId: string, @Body() reportDto: ReportIssueDto) {
        return this.teacherService.reportIssue(courseId, reportDto);
    }
}
