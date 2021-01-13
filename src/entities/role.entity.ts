import { Res } from "@nestjs/common";
import { PrivilegeDto } from "src/dtos/privilege.dto";
import { ResponseDto } from "src/dtos/response.dto";
import { RoleDto } from "src/dtos/role.dto";
import Language from "src/lib/Language";
import { BaseEntity, Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Application } from "./application.entity";
import { Organization } from "./organization.entity";
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
    public locked: boolean;

    @Column()
    public name: string;

    @ManyToOne(() => Organization, org => org.roles, {nullable: true})
    public organization?: Organization;

    @ManyToOne(() => Application, app => app.roles, {nullable: true})
    public application?: Application;


    @ManyToMany(() => Privilege, {eager: true})
    @JoinTable({
        name: "role_privileges"
    })
    public privileges: Privilege[];

    public async updateFromDto(dto: RoleDto) {
        if (this.locked) {
            throw new Error('Privilege is locked');
        }

        const existing = await this.organization.getRoleByName(dto.name);

        if (existing && existing.id !== this.id) {
            return ResponseDto.Error({name: Language.ROLE_EXISTS});
        }

        this.name = dto.name;
        this.privileges = await Privilege.findByIds(dto.privilegeIds);
        this.locked = dto.locked;
        await this.save();

        return ResponseDto.Success(this);
    }

    public static async createRole(name: string, privileges: Array<Privilege>, locked: boolean = false) {
        const role = new Role();
        role.name = name;
        role.privileges = privileges;
        role.locked = locked;
        await role.save();
        return role;
    }
}