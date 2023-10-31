import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class signInDTO {
    @IsEmail()
    @IsString()
    @IsNotEmpty()
    email: string
    @IsString()
    @IsNotEmpty()
    password: string
}