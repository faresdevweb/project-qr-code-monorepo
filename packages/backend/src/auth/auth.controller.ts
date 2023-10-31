import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { signInDTO, maintenanceAccountDTO, createSchoolDTO } from './dto';
import { JwtGuard, RolesGuard } from './guard';
import { Roles } from 'src/decorators';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService
    ){}

    @Post('signin')
    signin(@Body() signInDTO: signInDTO){
        return this.authService.signin(signInDTO);
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


}
