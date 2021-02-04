import { AppTokenDto } from "src/dtos/appToken.dto";
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Application, TOKEN_LENGTH } from "./application.entity";
import { RequestLog } from "./requestLog.entity";
import HCore from 'hcore';

@Entity()
export class AppToken extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    public id: string;

    @Column()
    public name: string;

    @Column()
    public token: string;

    @CreateDateColumn()
    public createdAt: Date;

    @Column({type: 'date', nullable: true})
    public expiresOn?: Date;

    @ManyToOne(() => Application, app => app.tokens)
    public application: Application;

    @OneToMany(() => RequestLog, log => log.appToken)
    public logs: RequestLog[];

    public async updateFromDTO(dto: AppTokenDto) {
        this.name = dto.name;
        this.expiresOn = new Date(dto.expiresOn);
        await this.save();
    }

    public cleaned() {
        return {
            id: this.id,
            name: this.name,
            expiresOn: this.expiresOn,
            application: this.application,
        }
    }
}