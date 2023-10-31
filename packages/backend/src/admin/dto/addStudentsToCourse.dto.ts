import { IsNotEmpty,IsString } from "class-validator";

export class addStudentsToCourseDTO {
    @IsNotEmpty()
    @IsString()
    groupId: string;
}