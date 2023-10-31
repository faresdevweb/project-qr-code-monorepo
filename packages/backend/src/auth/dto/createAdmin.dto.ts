import { IsString, IsNotEmpty, IsOptional } from "class-validator";

export class createAdminDTO {

    @IsString()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsNotEmpty()
    schoolCustomId: string;

    @IsString()
    @IsOptional()
    schoolId?: string;
}