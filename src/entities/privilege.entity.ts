import { BaseEntity, Column, CreateDateColumn, Entity, getConnection, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Application } from "./application.entity";
import { Organization } from "./organization.entity";

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

    @ManyToMany(() => Organization, org => org.privileges)
    public organizations: Organization[];

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

    public static async getOrganizationPrivilege(name: string, orgId: string) {
        return await Privilege.createQueryBuilder('p')
            .innerJoin('organization_privileges', 'op', 'op.organizationId = :orgId and op.privilegeId = p.id', {orgId})
            .where('p.name = :name', {name})
            .getOne();
    }

    public static async getApplicationPrivilege(name: string, appId: string) {
        return await Privilege.createQueryBuilder('p')
            .innerJoin('application_privileges', 'ap', 'ap.application_id = :appId and ap.privilegeId = p.id', {appId})
            .where('p.name = :name', {name})
            .getOne();
    }
}