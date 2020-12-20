import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Application } from "./application.entity";

@Entity()
export class Organization extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    public id: string;

    @CreateDateColumn()
    public createdAt: Date;

    @UpdateDateColumn()
    public deletedAt: Date;

    @Column()
    public name: string;

    @Column()
    public domain: string;

    @Column({type: "boolean", default: false})
    public restrictUsersToDomain: boolean;

    @OneToMany(() => Application, app => app.organization)
    public applications: Application[];
}