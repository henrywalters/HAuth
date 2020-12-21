import { IsNotEmpty, IsSemVer, IsString } from "class-validator";

export class ApplicationDto {
    @IsString()
    @IsNotEmpty()
    public name: string;

    @IsString()
    public organizationId: string;
}