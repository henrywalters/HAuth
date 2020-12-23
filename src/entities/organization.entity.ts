import { BaseEntity, Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Application } from "./application.entity";
import { Privilege } from "./privilege.entity";
import { Role } from "./role.entity";
import { User } from "./user.entity";

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

    @ManyToOne(() => User, {eager: true})
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
}