import { OrganizationDto } from "src/dtos/organization.dto";
import { PrivilegeDto } from "src/dtos/privilege.dto";
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

    @ManyToMany(() => Role)
    @JoinTable({
        name: 'organization_roles',
    })
    public roles: Role[];

    @ManyToMany(() => Privilege)
    @JoinTable({
        name: 'organization_privileges'
    })
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
        return await Privilege.createQueryBuilder('p')
            .innerJoin('p.organizations', 'organization', 'organization.id = :id', {id: this.id})
            .getMany();
    }

    public async addPrivilege(dto: PrivilegeDto) {
        if (await Privilege.getOrganizationPrivilege(dto.name, this.id)) {
            throw new Error("Privilege with this name already exists");
        }

        const privilege = await Privilege.createPrivilege(dto.name, dto.locked);

        this.privileges = this.privileges ? this.privileges : [];
        this.privileges.push(privilege);

        await this.save();

        return privilege;
    }

    public async removePrivilege(id: string) {
        this.privileges = this.privileges.filter(p => p.id !== id);
        await this.save();
    }

    public async removeUser(email: string) {
        const user = await User.createQueryBuilder('user')
            .innerJoin('user.organizations', 'organization', 'organization.id = :id', {id: this.id})
            .where('user.email = :email', {email,})
            .getOne();

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