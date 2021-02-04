import { BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { RequestLog } from "./requestLog.entity";

@Entity()
export class DeviceLog extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    public id: string;

    @OneToOne(() => RequestLog)
    @JoinColumn()
    public requestLog: RequestLog;

    @Column()
    public clientType: string;

    @Column()
    public clientName: string;

    @Column()
    public clientVersion: string;

    @Column()
    public osName: string;

    @Column()
    public osVersion: string;

    @Column()
    public osPlatform: string;

    @Column()
    public deviceType: string;

    @Column()
    public deviceBrand: string;

    @Column()
    public deviceModel: string;

}