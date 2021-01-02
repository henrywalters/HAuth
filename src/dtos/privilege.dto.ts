import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class PrivilegeDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    public name: string;

    @IsBoolean()
    @ApiProperty({description: 'Controls the mutability of a privilege'})
    public locked: boolean;
}