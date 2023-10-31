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
import { CreateClassDTO, CreateFiliereDTO, CreateYearDTO } from './dto';

@Controller('admin')
export class AdminController {
    constructor(
        private adminService: AdminService
    ){}

    @Post("createFiliere")
    @UseGuards(JwtGuard, RolesGuard)
    @Roles('ADMIN')
    createFiliere(
      @Body() createFiliereDTO: CreateFiliereDTO,
      @Request() req: any
    ) {
        return this.adminService.createFiliere(createFiliereDTO,req.user);
    }

    @Post("createYear")
    @UseGuards(JwtGuard, RolesGuard)
    @Roles('ADMIN')
    createYear(
      @Body() createYearDTO: CreateYearDTO,
      @Request() req: any
    ) {
        return this.adminService.createYear(createYearDTO, req.user);
    }

    @Post("createClass")
    @UseGuards(JwtGuard, RolesGuard)
    @Roles('ADMIN')
    createClass(
      @Body() createClassDTO: CreateClassDTO,
      @Request() req: any
    ) {
        return this.adminService.createClass(createClassDTO, req.user);
    }
}
