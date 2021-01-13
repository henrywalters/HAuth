import { Res } from "@nestjs/common";
import { OrganizationDto } from "src/dtos/organization.dto";
import { PrivilegeDto } from "src/dtos/privilege.dto";
import { ResponseDto } from "src/dtos/response.dto";
import { RoleDto } from "src/dtos/role.dto";
import Language from "src/lib/Language";
import { BaseEntity, Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Application } from "./application.entity";
import { Privilege } from "./privilege.entity";
import { Role } from "./role.entity";
import { User } from "./user.entity";

const DEFAULT_ORG_PRIVILEGES: string[] = [
    'VIEW_INFO',
    'EDIT_INFO',
    'ADD_USER',
    'REMOVE_USER',
    'VIEW_USER',
    'ADD_APPLICATION',
    'VIEW_APPLICATION',
    'EDIT_APPLICATION',
    'REMOVE_APPLICATION',
    'ADD_PRIVILEGE',
    'VIEW_PRIVILEGE',
    'REMOVE_PRIVILEGE',
    'EDIT_PRIVILEGE',
    'ADD_ROLE',
    'VIEW_ROLE',
    'REMOVE_ROLE',
    'EDIT_ROLE',
];

@Entity()
export class Organization extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    public id: string;

    @CreateDateColumn()
    public createdAt: Date;

    @UpdateDateColumn()
    public updatedAt: Date;

    @Column()
    public name: string;

    @Column()
    public domain: string;

    @ManyToOne(() => User)
    public owner: User;

    @Column({type: "boolean", default: false})
    public restrictUsersToDomain: boolean;

    @OneToMany(() => Application, app => app.organization)
    public applications: Application[];

    @OneToMany(() => Role, role => role.organization)
    public roles: Role[];

    @OneToMany(() => Privilege, privilege => privilege.organization)
    public privileges: Privilege[];

    public async addUser(email: string) {
        const newUser = await User.findByEmail(email);
        if (!newUser) {
            throw new Error(Language.USER_404);
        }

        if (this.restrictUsersToDomain && !newUser.belongsToDomain(this.domain)) {
            throw new Error(Language.USER_INVALID_DOMAIN);
        }

        newUser.organizations = newUser.organizations ? newUser.organizations : [];
        newUser.organizations.push(this);
        await newUser.save();

        console.log(newUser);

        return newUser;
    }

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

    public async removeUser(id: string) {
        const user = await User.createQueryBuilder('user')
            .innerJoinAndSelect('user.organizations', 'organization', 'organization.id = :id', {id: this.id})
            .where('user.id = :id', {id,})
            .getOne();

        console.log(user);

        user.organizations = user.organizations.filter(org => org.id !== this.id);
        await user.save();
    }

    public async getUsers() {
        const query = await User.createQueryBuilder('user')
            .innerJoin('user.organizations', 'organization', 'organization.id = :id', {id: this.id});
        return await query.getMany();
    }

    public async getApplications() {
        return await Application.find({
            where: {
                organization: this,
            }
        })
    }

    public async removeApplication(id: string) {
        const application = await Application.findOne(id);
        if (application.organization.id === this.id) {
            await application.remove();
        }
    }

    public async updateFromDTO(dto: OrganizationDto) {
        this.name = dto.name;
        this.domain = dto.domain;
        this.restrictUsersToDomain = dto.restrictUsersToDomain;
        await this.save();
    }

    public static async createFromDTO(owner: User, dto: OrganizationDto) {
        const org = new Organization();
        org.owner = owner;
        const ownerPrivileges = await Privilege.createPrivileges(DEFAULT_ORG_PRIVILEGES, true);
        const ownerRole = await Role.createRole('OWNER', ownerPrivileges, true);

        owner.roles = owner.roles ? owner.roles : [];
        owner.roles.push(ownerRole);

        await owner.save();

        org.privileges = ownerPrivileges;
        org.roles = [ownerRole];

        await org.updateFromDTO(dto);

        return org;
    }
}