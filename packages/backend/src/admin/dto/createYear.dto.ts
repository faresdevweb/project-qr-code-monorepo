import { IsString } from "class-validator";

export class CreateYearDTO {
    @IsString()
    year: string;

    @IsString()
    filiereId: string;
}