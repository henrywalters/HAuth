import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsSemVer, IsString } from "class-validator";

export class ApplicationDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    public name: string;
}