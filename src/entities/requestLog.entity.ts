import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { AppToken } from "./appToken.entity";
import { BotLog } from "./botLog.entity";
import { DeviceLog } from "./deviceLog.entity";
import { User } from "./user.entity";

@Entity()
export class RequestLog extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    public id: string;

    @CreateDateColumn()
    public timestamp: Date;

    @Column()
    public ip: string;

    @Column()
    public url: string;

    @Column({type: 'boolean', default: false})
    public blocked: boolean;

    @Column({type: 'text', nullable: true})
    public error?: string;

    @OneToOne(() => DeviceLog)
    public device?: DeviceLog;

    @OneToOne(() => BotLog)
    public bot?: BotLog;

    @ManyToOne(() => User, user => user.logs, {nullable: true})
    @JoinColumn()
    public user?: User;

    @ManyToOne(() => AppToken, token => token.logs, {nullable: true})
    @JoinColumn()
    public appToken?: AppToken;

    public static async setUserOfLog(logId: string, user: User) {
        await RequestLog.createQueryBuilder()
            .update()
            .set({user: {id: user.id}})
            .where("id = :id", {id: logId})
            .execute();
    }

    public static async setAppOfLog(logId: string, token: AppToken) {
        await RequestLog.createQueryBuilder()
            .update()
            .set({appToken: {id: token.id}})
            .where("id = :id", {id: logId})
            .execute();
    }

    public static async block(logId: string, error: string) {
        await RequestLog.createQueryBuilder()
            .update()
            .set({blocked: true, error})
            .where("id = :id", {id: logId})
            .execute();
    }
}