import { BaseEntity, Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Client } from "./client.entity";
import { Organization } from "./organization.entity";
import { Privilege } from "./privilege.entity";
import { Role } from "./role.entity";

@Entity()
export class Application extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    public id: string;

    @CreateDateColumn()
    public createdAt: Date;

    @UpdateDateColumn()
    public updatedAt: Date;

    @Column()
    public name: string;

    @ManyToOne(() => Organization, organization => organization.applications)
    public organization: Organization;

    @OneToMany(() => Client, client => client.application)
    public clients: Client[];

    @ManyToMany(() => Role)
    @JoinTable({
        name: 'application_roles',
    })
    public roles: Role[];

    @ManyToMany(() => Privilege)
    @JoinTable({
        name: 'application_privileges'
    })
    public privileges: Privilege[];
}