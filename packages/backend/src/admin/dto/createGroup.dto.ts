import { IsNotEmpty, IsString } from "class-validator";


export class createGroupDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsString()
  yearId: string;

  @IsNotEmpty()
  @IsString()
  classId: string;
}