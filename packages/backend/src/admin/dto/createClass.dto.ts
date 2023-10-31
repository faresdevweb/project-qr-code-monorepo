import { IsString } from "class-validator";

export class CreateClassDTO {
    @IsString()
    name: string;

    @IsString()
    yearId: string;
}