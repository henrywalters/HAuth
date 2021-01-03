import { ApplicationDto } from "src/dtos/application.dto";
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

    @OneToMany(() => Role, role => role.application)
    public roles: Role[];

    @OneToMany(() => Privilege, privilege => privilege.application)
    public privileges: Privilege[];

    public async updateFromDTO(dto: ApplicationDto) {
        this.name = dto.name;
        await this.save();
    }

    public static async createFromDTO(org: Organization, dto: ApplicationDto) {
        const app = new Application();
        app.organization = org;
        app.roles = [];
        app.privileges = [];
        await app.updateFromDTO(dto);
        return app;
    }
}