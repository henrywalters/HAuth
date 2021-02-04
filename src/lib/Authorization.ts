import { Injectable, NotImplementedException } from "@nestjs/common";
import { AuthorizationSummary } from "src/dtos/authorization.dto";
import { PrivilegeDto } from "src/dtos/privilege.dto";
import { ResponseDto } from "src/dtos/response.dto";
import { RoleDto } from "src/dtos/role.dto";
import { Privilege } from "src/entities/privilege.entity";
import { Role } from "src/entities/role.entity";
import { User } from "src/entities/user.entity";
import { generateMap } from "./Functional";
import Language from "./Language";
import List from "./List";
import { Securable, SecureType } from "./Securable.interface";
import Set from "./Set";

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

    public async authorize(securable: Securable, user: User, privilegeNames: string[]): Promise<AuthorizationSummary> {
        const summary = {
            passed: [],
            failed: [],
        };

        const privileges = await this.getPrivilegesByNames(securable, privilegeNames);

        console.log(privileges);
        const privilegeMap = generateMap<Privilege>(privileges, (p) => p.name);

        console.log(privilegeMap);

        for (const pName of privilegeNames) {
            if (privilegeMap[pName] && user.hasPrivilege(privilegeMap[pName])) {
                summary.passed.push(pName);
            } else {
                summary.failed.push(pName);
            }
        }

        return summary;
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

    public async getPrivilegesByNames(securable: Securable, names: string[]) {
        const query = await Privilege.createQueryBuilder('p')
            .where(`p.${securable.secureType}Id = :${securable.secureType}`, {[securable.secureType]: securable.id})
            .andWhere('name in (:...names)', {names});
        return await query.getMany();
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

    public async getAuthorizedUser(securable: Securable, userId: string): Promise<User> {
        const query = await User.createQueryBuilder('u')
            .leftJoinAndSelect('u.roles', 'r', `r.${securable.secureType}Id = :${securable.secureType}`, {[securable.secureType]: securable.id})
            .leftJoinAndSelect('u.privileges', 'p', `p.${securable.secureType}Id = :${securable.secureType}`, {[securable.secureType]: securable.id})
            .leftJoinAndSelect('r.privileges', 'rp')
            .leftJoinAndSelect('u.applicationRoles', 'ar', `ar.${securable.secureType}Id = :${securable.secureType}`, {[securable.secureType]: securable.id})
            .leftJoinAndSelect('ar.privileges', 'arp')
            .leftJoinAndSelect('u.applicationPrivileges', 'ap', `ap.${securable.secureType}Id = :${securable.secureType}`, {[securable.secureType]: securable.id})
            .leftJoinAndSelect(`p.${securable.secureType}`, `p_${securable.secureType}`)
            .leftJoinAndSelect(`r.${securable.secureType}`, `r_${securable.secureType}`)
            .leftJoinAndSelect(`ap.${securable.secureType}`, `ap_${securable.secureType}`)
            .leftJoinAndSelect(`ar.${securable.secureType}`, `ar_${securable.secureType}`)
            .where('u.id = :userId', {userId});

        return await query.getOneOrFail();
    }

    public async getUserPrivileges(securable: Securable, userId: string): Promise<Privilege[]> {

        return (await User.createQueryBuilder('u')
            .leftJoinAndSelect('u.privileges', 'p', `p.${securable.secureType}Id = :${securable.secureType}`, {[securable.secureType]: securable.id})
            .where('u.id = :userId', {userId})
            .getOne()).privileges;
    }

    public async getUserRoles(securable: Securable, userId: string): Promise<Role[]> {
        return (await User.createQueryBuilder('u')
            .leftJoinAndSelect('u.roles', 'r', `r.${securable.secureType}Id = :${securable.secureType}`, {[securable.secureType]: securable.id})
            .leftJoinAndSelect('r.privileges', 'p')
            .where('u.id = :userId', {userId})
            .getOne()).roles;
    }

    public async assignUserPrivileges(securable: Securable, userId: string, privilegeIds: string[]) {
        const relation = securable.secureType === SecureType.APPLICATION ? 'applicationPrivileges': 'privileges';
        const user = await this.getAuthorizedUser(securable, userId);
        const privileges = await Privilege.findByIds(privilegeIds);

        user[relation] = user[relation].filter(priv => {
            return priv[securable.secureType].id !== securable.id;
        }).concat(privileges);

        await user.save();

        return user;
    }

    public async assignUserRoles(securable: Securable, userId: string, roleIds: string[]) {
        const relation = securable.secureType === SecureType.APPLICATION ? 'applicationRoles' : 'roles';
        const user = await this.getAuthorizedUser(securable, userId);
        const roles = await Role.findByIds(roleIds);

        user[relation] = user[relation].filter(role => {
            return role[securable.secureType].id !== securable.id;
        }).concat(roles);

        await user.save();

        return user;
    }
}