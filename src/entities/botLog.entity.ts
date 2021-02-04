import { BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { RequestLog } from "./requestLog.entity";

@Entity()
export class BotLog extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    public id: string;

    @OneToOne(() => RequestLog)
    @JoinColumn()
    public requestLog: RequestLog;

    @Column()
    public name: string;

    @Column()
    public category: string;

    @Column()
    public url: string;

    @Column()
    public producerName: string;

    @Column()
    public producerUrl: string;
}