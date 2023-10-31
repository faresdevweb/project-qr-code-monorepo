import { Body, Controller } from '@nestjs/common';
import { Param, Put, Req, UseGuards, Get } from '@nestjs/common';
import { JwtGuard, RolesGuard } from 'src/auth/guard';
import { Roles } from 'src/decorators';
import { StudentService } from './student.service';
import { Request } from 'express';


@Controller('student')
export class StudentController {
    constructor(
        private studentService: StudentService
    ){}

    @Put(':courseId/sign-in')
    @UseGuards(JwtGuard, RolesGuard)
    @Roles('STUDENT')
    answerToCallStudents(
      @Param('courseId') courseId: string,
      @Req() req: Request,
      @Body('token') qrToken: string
    ) {
      return this.studentService.signInWithQr(courseId, (req.user as any).id, qrToken);
    }
}
