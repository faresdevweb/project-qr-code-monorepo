import { Body, Controller, Get, Post, Request, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { signInDTO, maintenanceAccountDTO, createSchoolDTO, createAdminDTO } from './dto';
import { JwtGuard, RolesGuard } from './guard';
import { Roles } from 'src/decorators';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService
    ){}

    @Post('signin')
    signin(@Body() signInDTO: signInDTO){
        return this.authService.signin(signInDTO);
    }

    @UseGuards(JwtGuard)
    @Get('getTeacher')
    getTeacher(){
        return this.authService.getTeacher();
    }

    @Post('maintenance')
    createMaintenanceAccount(@Body() maintenanceAccountDTO: maintenanceAccountDTO){
        return this.authService.createMaintenanceAccount(maintenanceAccountDTO)
    }

    @UseGuards(JwtGuard)
    @Get('verify-token')
    verifyToken(){
        return { success: true };
    }

    @UseGuards(JwtGuard, RolesGuard)
    @Post('createSchool')
    @Roles('MAINTENANCE')
    async createSchool(@Body() createSchoolDto: createSchoolDTO) {
        return this.authService.createSchool(createSchoolDto);
    }

    @UseGuards(JwtGuard, RolesGuard)
    @Post('createAdmin')
    @Roles('MAINTENANCE')
    async createAdmin(@Body() createAdminDto: createAdminDTO) {
        return this.authService.createAdmin(createAdminDto);
    }

    @UseGuards(JwtGuard, RolesGuard)
    @Post('createStudent')
    @Roles('ADMIN')
    @UseInterceptors(FileInterceptor('csv'))
    async createStudent( 
        @UploadedFile() file: Express.Multer.File,
        @Request() req: any 
    ) {
        return this.authService.createStudent(file, req.user);
    }

    @UseGuards(JwtGuard, RolesGuard)
    @Post('createTeacher')
    @Roles('ADMIN')
    @UseInterceptors(FileInterceptor('csv'))
    async createTeacher(
        @UploadedFile() file: Express.Multer.File,
        @Request() req: any 
    ) {
        return this.authService.createTeacher(file,req);
    }


}
