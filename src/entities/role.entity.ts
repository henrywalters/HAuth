import { BaseEntity, Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Application } from "./application.entity";
import { Privilege } from "./privilege.entity";

@Entity()
export class Role extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    public id: string;

    @CreateDateColumn()
    public createdAt: Date;

    @UpdateDateColumn()
    public updatedAt: Date;

    // Locked controls whether a privileges name may ever be modifed
    @Column({type: "bool", default: false})
    public locked: true;

    @Column()
    public name: string;

    @ManyToMany(() => Privilege, {eager: true})
    @JoinTable({
        name: "role_privileges"
    })
    public privileges: Privilege[];

    @ManyToOne(() => Application)
    public application: Application;

    public static async createRole(name: string, privileges: Array<Privilege>) {
        const role = new Role();
        role.name = name;
        role.privileges = privileges;
        await role.save();
        return role;
    }
}