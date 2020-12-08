import { BaseEntity, Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Application } from "./application.entity";

@Entity()
export class Privilege extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    public id: string;

    @CreateDateColumn()
    public createdAt: Date;

    @UpdateDateColumn()
    public deletedAt: Date;

    // Locked controls whether a privileges name may ever be modifed
    @Column({type: "bool", default: false})
    public locked: true;

    @Column()
    public name: string;

    @ManyToMany(() => Privilege)
    @JoinTable({
        name: "privileges_allowed_to_enable"
    })
    public privilegesAllowedToEnable: Privilege[];

    @ManyToOne(() => Application)
    public application: Application;

    public static async createPrivilege(name: string) {
        const priv = new Privilege();
        priv.name = name;
        await priv.save();
        return priv;
    }
}