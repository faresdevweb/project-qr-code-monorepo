import { 
    Body, 
    Controller, 
    Get, 
    Param, 
    Post, 
    UseGuards,
    Request, 
    UseInterceptors, 
    UploadedFile,
    Put} from '@nestjs/common';
import { AdminService } from './admin.service';
import { Roles } from 'src/decorators';
import { JwtGuard, RolesGuard } from 'src/auth/guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('admin')
export class AdminController {
    constructor(
        private adminService: AdminService
    ){}
}
