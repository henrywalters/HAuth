import { Res } from "@nestjs/common";
import { PrivilegeDto } from "src/dtos/privilege.dto";
import { ResponseDto } from "src/dtos/response.dto";
import Language from "src/lib/Language";
import { BaseEntity, Column, CreateDateColumn, Entity, getConnection, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Application } from "./application.entity";
import { Organization } from "./organization.entity";
import { User } from "./user.entity";

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

    @ManyToOne(() => Organization, org => org.privileges, {nullable: true})
    public organization?: Organization;

    @ManyToOne(() => Application, app => app.privileges, {nullable: true})
    public application?: Application;

    @ManyToMany(() => User, user => user.privileges)
    public users: User[];

    public async updateFromDTO(dto: PrivilegeDto) {
        this.name = dto.name;
        this.locked = dto.locked;
        await this.save();

        return this;
    }

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