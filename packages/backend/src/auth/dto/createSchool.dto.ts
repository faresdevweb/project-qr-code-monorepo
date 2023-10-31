import { IsString, IsNotEmpty } from 'class-validator';

export class createSchoolDTO {
    @IsString()
    @IsNotEmpty()
    name: string;
    
    @IsString()
    @IsNotEmpty()
    schoolId?: string;
}