import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { signInDTO, maintenanceAccountDTO } from './dto';

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
}
