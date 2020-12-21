import { IsBoolean, IsString } from "class-validator";

export class OrganizationDto {
    @IsString()
    public name: string;

    @IsString()
    public domain: string;

    @IsBoolean()
    public restrictUsersToDomain: boolean;
}