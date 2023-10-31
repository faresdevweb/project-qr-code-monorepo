import { UserRole } from "@prisma/client";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class maintenanceAccountDTO {
    @IsString()
    @IsEmail()
    @IsNotEmpty()
    email: string;
    @IsString()
    @IsNotEmpty()
    password: string;
    @IsString()
    @IsNotEmpty()
    role: UserRole = "MAINTENANCE";
}