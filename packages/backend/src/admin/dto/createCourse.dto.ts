import { IsString, IsOptional, IsInt, IsArray, IsNotEmpty, IsBoolean } from 'class-validator';

export class createCourseDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    teacherId: string;

    @IsOptional()
    @IsArray()
    studentsId: string[];

    @IsOptional()
    @IsArray()
    signedInStudents: string[];

    @IsString()
    @IsNotEmpty()
    startingTime: Date;

    @IsInt()
    duration: number; // en heures

    @IsBoolean()
    @IsOptional()
    started: boolean;

    @IsString()
    @IsOptional()
    groupId: string;

    @IsString()
    @IsOptional()
    schoolId: string;
}