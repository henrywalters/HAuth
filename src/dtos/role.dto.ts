import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsString } from "class-validator";

export class RoleDto {

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    public name: string;

    @IsArray()
    @ApiProperty({description: 'List of privileges to belong in the role'})
    public privilegeIds: string[];
}