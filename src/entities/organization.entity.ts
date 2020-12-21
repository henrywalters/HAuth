import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Application } from "./application.entity";
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

    @ManyToOne(() => User)
    public owner: User;

    @Column({type: "boolean", default: false})
    public restrictUsersToDomain: boolean;

    @OneToMany(() => Application, app => app.organization)
    public applications: Application[];
}