import { BaseEntity, Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Organization } from "./organization.entity";
import { Privilege } from "./privilege.entity";
import { RequestLog } from "./requestLog.entity";
import { Role } from "./role.entity";

export enum AuthType {
    Standard = 'Standard',
    Google = 'Google',
}

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    public id: string;

    @CreateDateColumn()
    public createdAt: Date;

    @UpdateDateColumn()
    public updatedAt: Date;

    @Column()
    public name: string;

    @Column()
    public email: string;

    @Column({nullable: true})
    public thumbnailUrl?: string;

    @Column({type: "enum", enum: AuthType})
    public authType: AuthType;

    @Column({nullable: true})
    public password?: string;

    @ManyToMany(() => Organization)
    @JoinTable({
        name: "user_organizations",
    })
    public organizations: Organization[];

    @ManyToMany(() => Role, {eager: true})
    @JoinTable({
        name: "user_roles",
    })
    public roles: Role[];

    @ManyToMany(() => Privilege, {eager: true})
    @JoinTable({
        name: "user_privileges"
    })
    public privileges: Privilege[];

    @ManyToMany(() => Role, {eager: true})
    @JoinTable({
        name: "user_application_roles",
    })
    public applicationRoles: Role[];

    @ManyToMany(() => Privilege, {eager: true})
    @JoinTable({
        name: "user_application_privileges"
    })
    public applicationPrivileges: Privilege[];

    @OneToMany(() => RequestLog, log => log.user)
    public logs: RequestLog[];

    public static async findByEmail(email: string) {
        return await User.findOne({
            where: {
                email,
            }
        });
    }

    public async getAssociatedOrganizations(): Promise<Organization[]> {

        const query = await User.createQueryBuilder('u')
        .where('u.id = :id', {id: this.id})
        .leftJoin('user_organizations', 'uo', 'uo.userId = u.id')
        .leftJoinAndMapMany('u.organizations', 'organization', 'o', 'o.ownerId = u.id or o.id = uo.organizationId');

        return (await query.getOne()).organizations;
    }

    public belongsToDomain(domain: string) {
        const userDomain = this.email.split('@')[1];
        return userDomain === domain;
    }

    // Checks if a user has a privilege directly or through a role
    public hasPrivilege(privilege: Privilege) {
        for (const priv of this.privileges) {
            if (priv.id === privilege.id) {
                return true;
            }
        }

        for (const role of this.roles) {
            for (const priv of role.privileges) {
                if (priv.name === privilege.name) {
                    console.log(priv);
                    console.log(privilege);
                }
                if (priv.id === privilege.id) {
                    return true;
                }
            }
        }

        for (const priv of this.applicationPrivileges) {
            if (priv.id === privilege.id) {
                return true;
            }
        }

        for (const role of this.applicationRoles) {
            for (const priv of role.privileges) {
                if (priv.name === privilege.name) {
                    console.log(priv);
                    console.log(privilege);
                }
                if (priv.id === privilege.id) {
                    return true;
                }
            }
        }

        return false;
    }

    public cleaned() {
        return {
            id: this.id,
            name: this.name,
            email: this.email,
            thumbnailUrl: this.thumbnailUrl,
        }
    }
}