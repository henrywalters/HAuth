import { IsArray, IsOptional, IsString } from "class-validator";
import { Privilege } from "src/entities/privilege.entity";

export class AssignPrivilegesAndRolesRequest {
    @IsArray()
    public privilegeIds: string[];

    @IsArray()
    public roleIds: string[];
}

export class AuthorizationRequest {
    @IsString()
    @IsOptional()
    public privilege?: string;

    @IsArray()
    @IsOptional()
    public privileges?: string[];
}

export interface AuthorizationSummary {
    passed: string[];
    failed: string[];
}