import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEmail, IsString } from "class-validator";
import { IsDomain } from "src/validators/domain.validator";

export class OrganizationDto {
    @IsString()
    @ApiProperty()
    public name: string;

    @IsDomain({
        message: "Must be valid domain such as google.com or henrywalters.dev"
    })
    @ApiProperty()
    public domain: string;

    @IsBoolean()
    @ApiProperty()
    public restrictUsersToDomain: boolean;
}

export class AddUserDto {
    @IsEmail()
    @ApiProperty()
    public email: string;
}