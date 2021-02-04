import { ApplicationDto } from "src/dtos/application.dto";
import { Securable, SecureType } from "src/lib/Securable.interface";
import { BaseEntity, Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { AppToken } from "./appToken.entity";
import { Client } from "./client.entity";
import { Organization } from "./organization.entity";
import { Privilege } from "./privilege.entity";
import { Role } from "./role.entity";
import HCore from 'hcore';
import { AppTokenDto } from "src/dtos/appToken.dto";

export const TOKEN_LENGTH = 128;

@Entity()
export class Application extends BaseEntity implements Securable {

    public secureType: SecureType = SecureType.APPLICATION;
    
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

    @OneToMany(() => AppToken, token => token.application)
    public tokens: AppToken[];

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

    public async createAppToken(dto: AppTokenDto): Promise<AppToken> {
        const token = new AppToken();
        token.application = this;
        token.name = dto.name
        token.expiresOn = dto.expiresOn ? new Date(dto.expiresOn) : void 0;
        token.token = HCore.Random.token(128);
        await token.save();
        return token;
    }

    public async getTokens(): Promise<AppToken[]> {
        return await AppToken.find({
            where: {
                application: {
                    id: this.id,
                }
            }
        });
    }

    public async getToken(id: string): Promise<AppToken> {
        return await AppToken.findOneOrFail({
            where: {
                application: {
                    id: this.id,
                },
                id,
            }
        });
    }
}