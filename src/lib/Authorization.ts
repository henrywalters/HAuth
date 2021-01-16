import { Injectable, NotImplementedException } from "@nestjs/common";
import { PrivilegeDto } from "src/dtos/privilege.dto";
import { ResponseDto } from "src/dtos/response.dto";
import { RoleDto } from "src/dtos/role.dto";
import { Privilege } from "src/entities/privilege.entity";
import { Role } from "src/entities/role.entity";
import Language from "./Language";
import { Securable, SecureType } from "./Securable.interface";

@Injectable()
export class Authorization {

    private getSecurableClause(securable: Securable) {
        switch(securable.secureType) {
            case SecureType.APPLICATION:
                return {
                    application: {
                        id: securable.id,
                    }
                }
            case SecureType.ORGANIZATION:
                return {
                    organization: {
                        id: securable.id,
                    }
                }
            default:
                throw new NotImplementedException("Secure Type where clause not defined");
        }
    }

    public async getPrivileges(securable: Securable) {
        return await Privilege.find({
            where: {
                ...this.getSecurableClause(securable),
            },
            order: {
                name: 'ASC',
            }
        })
    }

    public async getPrivilege(securable: Securable, id: string) {
        return await Privilege.findOneOrFail({
            where: {
                ...this.getSecurableClause(securable),
                id,
            },
            relations: ['organization'],
        })
    }

    public async getPrivilegeByName(securable: Securable, name: string) {
        return await Privilege.findOne({
            where: {
                ...this.getSecurableClause(securable),
                name,
            }
        })
    }

    public async addPrivilege(securable: Securable, dto: PrivilegeDto) {
        if (await this.getPrivilegeByName(securable, dto.name)) {
            return ResponseDto.Error({name: Language.PRIVILEGE_EXISTS});
        }

        const privilege = await Privilege.createPrivilege(dto.name, dto.locked);

        securable.privileges = securable.privileges ? securable.privileges : [];
        securable.privileges.push(privilege);

        await securable.save();

        return ResponseDto.Success(this);
    }

    public async updatePrivilege(securable: Securable, id: string, dto: PrivilegeDto) {
        const privilege = await this.getPrivilege(securable, id);

        if (privilege.locked) {
            return ResponseDto.Error(Language.PRIVILEGE_LOCKED);
        }

        const existing = await this.getPrivilegeByName(securable, dto.name);

        console.log(existing);

        if (existing && privilege.id !== existing.id) {
            return ResponseDto.Error({
                name: Language.PRIVILEGE_EXISTS,
            })
        }

        return ResponseDto.Success(await privilege.updateFromDTO(dto));
    }

    public async removePrivilege(securable: Securable, id: string) {
        securable.privileges = securable.privileges.filter(p => p.id !== id || p.locked);
        await securable.save();
    }
    
    public async getRoles(securable: Securable) {
        
        return await Role.createQueryBuilder('r')
            .leftJoinAndSelect('r.privileges', 'privileges')
            .where(`r.${securable.secureType}Id = :${securable.secureType}`, {[securable.secureType]: securable.id})
            .orderBy('r.name', 'ASC')
            .addOrderBy(`privileges.name`, 'ASC')
            .getMany();
    }

    public async getRole(securable: Securable, id: string) {
        return await Role.findOneOrFail({
            where: {
                ...this.getSecurableClause(securable),
                id,
            },
            relations: ['organization'],
        })
    }

    public async getRoleByName(securable: Securable, name: string) {
        return await Role.findOne({
            where: {
                ...this.getSecurableClause(securable),
                name,
            }
        })
    }

    public async createRole(securable: Securable, dto: RoleDto) {
        if (await this.getRoleByName(securable, dto.name)) {
            return ResponseDto.Error({name: Language.ROLE_EXISTS});
        }

        const role = await Role.createRole(dto.name, await Privilege.findByIds(dto.privilegeIds));

        securable.roles = securable.roles ? securable.roles : [];
        securable.roles.push(role);

        await securable.save();

        return ResponseDto.Success(this);
    }

    public async updateRole(securable: Securable, id: string, dto: RoleDto) {
        const role = await this.getRole(securable, id);

        if (role.locked) {
            return ResponseDto.Error(Language.ROLE_LOCKED);
        }

        const existing = await this.getRoleByName(securable, dto.name);

        if (existing && role.id !== existing.id) {
            return ResponseDto.Error({
                name: Language.ROLE_EXISTS
            })
        }
        
        return ResponseDto.Success(await role.updateFromDto(dto));

    }

    public async removeRole(securable: Securable, id: string) {
        securable.roles = securable.roles.filter(r => r.id !== id || r.locked);
        await securable.save();
    }
}