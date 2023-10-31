import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { signInDTO, maintenanceAccountDTO } from './dto';
import { JwtGuard } from './guard';

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


}
