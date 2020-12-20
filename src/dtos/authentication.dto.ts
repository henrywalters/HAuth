import { IsEmail, IsObject, IsOptional, IsString } from "class-validator";

export class StandardRegisterDto {

    @IsString()
    public name: string;

    @IsEmail()
    public email: string;

    @IsString()
    public password: string;

    @IsString()
    @IsOptional()
    public organizationId?: string;
}

export class StandardLoginDto {
    @IsEmail()
    public email: string;

    @IsString()
    public password: string;
}

export class RefreshDto {
    @IsString()
    public refreshToken: string;
}