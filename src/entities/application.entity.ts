import { BaseEntity, Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Client } from "./client.entity";
import { Privilege } from "./privilege.entity";
import { Role } from "./role.entity";

@Entity()
export class Application extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    public id: string;

    @CreateDateColumn()
    public createdAt: Date;

    @UpdateDateColumn()
    public deletedAt: Date;

    @Column()
    public name: string;

    @OneToMany(() => Client, client => client.application)
    public clients: Client[];

    @OneToMany(() => Role, roles => roles.application)
    public roles: Role[];

    @OneToMany(() => Privilege, privilege => privilege.application)
    public privileges: Privilege[];
}