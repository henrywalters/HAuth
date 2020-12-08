import { BaseEntity, Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Application } from "./application.entity";
import { Privilege } from "./privilege.entity";
import { Role } from "./role.entity";
import { AuthorizationType } from "./user.entity";

export enum ClientType {
    WEB = 'Web',
    SERVER = 'Server',
    MOBILE = 'Mobile,'
}

@Entity()
export class Client extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    public id: string;

    @CreateDateColumn()
    public createdAt: Date;

    @UpdateDateColumn()
    public deletedAt: Date;

    @Column()
    public name: string;

    @Column({type: "enum", enum: ClientType})
    public type: ClientType;

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