import { IsString } from "class-validator";


export class CreateFiliereDTO  {
    @IsString()
    name: string;

    @IsString()
    schoolId: string;
}