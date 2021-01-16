import { Privilege } from "src/entities/privilege.entity";
import { Role } from "src/entities/role.entity";

export enum SecureType {
    ORGANIZATION = 'organization',
    APPLICATION = 'application',
}

export interface Securable {
    secureType: SecureType;
    id: string;
    privileges: Privilege[];
    roles: Role[];
    save: () => Promise<any>;
}