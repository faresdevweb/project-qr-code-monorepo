import { IsNotEmpty, IsString } from "class-validator";


export class ReportIssueDto {
    
    @IsString()
    @IsNotEmpty()
    description: string;
    
}