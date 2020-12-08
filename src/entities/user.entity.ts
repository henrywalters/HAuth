import { BaseEntity, Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
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
    public deletedAt: Date;

    @Column()
    public name: string;

    @Column()
    public email: string;

    @Column()
    public thumbnailUrl: string;

    @Column({type: "enum", enum: AuthorizationType})
    public authType: AuthorizationType;

    @Column({nullable: true})
    public password?: string;

    @ManyToMany(() => Role)
    @JoinTable({
        name: "user_roles",
    })
    public roles: Role[];

    @ManyToMany(() => Privilege)
    @JoinTable({
        name: "user_privileges"
    })
    public privileges: Privilege[];
}