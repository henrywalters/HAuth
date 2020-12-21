import { IsBoolean, IsString } from "class-validator";
import { IsDomain } from "src/validators/domain.validator";

export class OrganizationDto {
    @IsString()
    public name: string;

    @IsDomain({
        message: "Must be valid domain such as google.com or henrywalters.dev"
    })
    public domain: string;

    @IsBoolean()
    public restrictUsersToDomain: boolean;
}