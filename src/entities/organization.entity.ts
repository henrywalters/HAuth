
import { OrganizationDto } from "src/dtos/organization.dto";
import Language from "src/lib/Language";
import { Securable, SecureType } from "src/lib/Securable.interface";
import { BaseEntity, Column, CreateDateColumn, Db, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
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
    'ADD_APPLICATION_PRIVILEGE',
    'VIEW_APPLICATION_PRIVILEGE',
    'EDIT_APPLICATION_PRIVILEGE',
    'REMOVE_APPLICATION_PRIVILEGE',
    'ADD_APPLICATION_ROLE',
    'VIEW_APPLICATION_ROLE',
    'EDIT_APPLICATION_ROLE',
    'REMOVE_APPLICATION_ROLE',
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
export class Organization extends BaseEntity implements Securable {

    public secureType: SecureType = SecureType.ORGANIZATION;

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

    public async getUser(id: string) {
        const user = await User.createQueryBuilder('user')
            .innerJoinAndSelect('user.organizations', 'organization', 'organization.id = :orgId', {orgId: this.id})
            .where('user.id = :id', {id,})
            .getOneOrFail();
        return user;
    }

    public async removeUser(id: string) {
        const user = await this.getUser(id);

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

    public async getApplication(id: string) {
        return await Application.findOneOrFail({
            where: {
                organization: this,
                id,
            }
        });
    }

    public async removeApplication(id: string) {
        const application = await this.getApplication(id);
        await application.remove();
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