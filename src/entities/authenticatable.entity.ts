import { PrivilegeDto } from "src/dtos/privilege.dto";
import { ResponseDto } from "src/dtos/response.dto";
import { RoleDto } from "src/dtos/role.dto";
import Language from "src/lib/Language";
import { BaseEntity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Privilege } from "./privilege.entity";
import { Role } from "./role.entity";

export abstract class Authenticatable extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    public id: string;

    @OneToMany(() => Role, role => role.organization)
    public roles: Role[];

    @OneToMany(() => Privilege, privilege => privilege.organization)
    public privileges: Privilege[];

    public async getPrivileges() {
        return await Privilege.find({
            where: {
                organization: this,
            },
            order: {
                name: 'ASC',
            }
        })
    }

    public async getPrivilege(id: string) {
        return await Privilege.findOneOrFail({
            where: {
                organization: this,
                id,
            },
            relations: ['organization'],
        })
    }

    public async getPrivilegeByName(name: string) {
        return await Privilege.findOne({
            where: {
                organization: this,
                name,
            }
        })
    }

    public async addPrivilege(dto: PrivilegeDto) {
        if (await this.getPrivilegeByName(dto.name)) {
            return ResponseDto.Error({name: Language.PRIVILEGE_EXISTS});
        }

        const privilege = await Privilege.createPrivilege(dto.name, dto.locked);

        this.privileges = this.privileges ? this.privileges : [];
        this.privileges.push(privilege);

        await this.save();

        return ResponseDto.Success(this);
    }

    public async removePrivilege(id: string) {
        this.privileges = this.privileges.filter(p => p.id !== id || p.locked);
        await this.save();
    }
    
    public async getRoles() {
        return await Role.createQueryBuilder('r')
            .leftJoinAndSelect('r.privileges', 'privilege')
            .where('r.organizationId = :orgId', {orgId: this.id})
            .orderBy('r.name', 'ASC')
            .addOrderBy('privilege.name', 'ASC')
            .getMany();
    }

    public async getRole(id: string) {
        return await Role.findOneOrFail({
            where: {
                organization: this,
                id,
            },
            relations: ['organization'],
        })
    }

    public async getRoleByName(name: string) {
        return await Role.findOne({
            where: {
                organization: this,
                name,
            }
        })
    }

    public async createRole(dto: RoleDto) {
        if (await this.getRoleByName(dto.name)) {
            return ResponseDto.Error({name: Language.ROLE_EXISTS});
        }

        const role = await Role.createRole(dto.name, await Privilege.findByIds(dto.privilegeIds));

        this.roles = this.roles ? this.roles : [];
        this.roles.push(role);

        await this.save();

        return ResponseDto.Success(this);
    }

    public async removeRole(id: string) {
        this.roles = this.roles.filter(r => r.id !== id || r.locked);
        await this.save();
    }
}