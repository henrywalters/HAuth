import { BaseEntity, Column, CreateDateColumn, Entity, getConnection, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Application } from "./application.entity";

@Entity()
export class Privilege extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    public id: string;

    @CreateDateColumn()
    public createdAt: Date;

    @UpdateDateColumn()
    public updatedAt: Date;

    // Locked controls whether a privileges name may ever be modifed
    @Column({type: "bool", default: false})
    public locked: boolean;

    @Column()
    public name: string;

    @ManyToMany(() => Privilege)
    @JoinTable({
        name: "privileges_allowed_to_enable"
    })
    public privilegesAllowedToEnable: Privilege[];

    public static async createPrivilege(name: string, locked = false) {
        const priv = new Privilege();
        priv.name = name;
        priv.locked = locked;
        await priv.save();
        return priv;
    }

    public static async createPrivileges(names: string[], locked = false) {
        const privileges = [];
        for (const name of names) {
            privileges.push(await this.createPrivilege(name, locked));
        }
        return privileges;
    }
}