import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsObject, IsOptional, IsString } from "class-validator";

export class StandardRegisterDto {

    @IsString()
    @ApiProperty()
    public name: string;

    @IsEmail()
    @ApiProperty()
    public email: string;

    @IsString()
    @ApiProperty()
    public password: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional()
    public organizationId?: string;
}

export class StandardLoginDto {
    @IsEmail()
    @ApiProperty()
    public email: string;

    @IsString()
    @ApiProperty()
    public password: string;
}

export class RefreshDto {
    @IsString()
    @ApiProperty()
    public refreshToken: string;
}