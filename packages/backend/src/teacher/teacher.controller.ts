import { Body, Controller, Get, Param, Put, UseGuards, Request, Post } from '@nestjs/common';
import { JwtGuard, RolesGuard } from 'src/auth/guard';
import { Roles } from 'src/decorators';
import { TeacherService } from './teacher.service';

@Controller('teacher')
export class TeacherController {
    constructor(
        private readonly teacherService: TeacherService
    ){}
}
