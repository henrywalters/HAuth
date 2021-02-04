import { IsDateString, IsOptional, IsString } from "class-validator";

export class AppTokenDto {
    @IsString()
    public name: string;

    @IsDateString()
    @IsOptional()
    public expiresOn: string;
}