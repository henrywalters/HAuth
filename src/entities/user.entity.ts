import { BaseEntity, Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Organization } from "./organization.entity";
import { Privilege } from "./privilege.entity";
import { Role } from "./role.entity";

export enum AuthorizationType {
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

    @Column({type: "enum", enum: AuthorizationType})
    public authType: AuthorizationType;

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

    // Checks if a user has a privilege directly or through a role
    public hasPrivilege(privilege: Privilege) {
        for (const priv of this.privileges) {
            if (priv.id === privilege.id) {
                return true;
            }
        }

        for (const role of this.roles) {
            for (const priv of role.privileges) {
                if (priv.id === privilege.id) {
                    return true;
                }
            }
        }

        return false;
    }
}