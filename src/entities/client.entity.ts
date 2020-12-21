import { BaseEntity, Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Application } from "./application.entity";
import { Privilege } from "./privilege.entity";
import { Role } from "./role.entity";

@Entity()
export class Client extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    public id: string;

    @CreateDateColumn()
    public createdAt: Date;

    @UpdateDateColumn()
    public updatedAt: Date;

    @Column()
    public name: string;

    // A cryptographically random hex code to identify an application
    @Column()
    public key: string;

    // A hashed cryptically random buffer to verify the client 
    @Column()
    public secret: string;

    @ManyToOne(() => Application, app => app.clients)
    public application: Application;

    @ManyToMany(() => Role)
    @JoinTable({
        name: "client_roles",
    })
    public roles: Role[];

    @ManyToMany(() => Privilege)
    @JoinTable({
        name: "client_privileges"
    })
    public privileges: Privilege[];
}