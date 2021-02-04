import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class UserSession extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    public id: string;

    @Column({type: "timestamp"})
    public sessionStart: Date;

    @Column({type: "timestamp", nullable: true})
    public sessionEnd: Date;

    @ManyToOne(() => User)
    @JoinColumn()
    public user: User;

    public static async createUserSession(user: User): Promise<UserSession> {
        let session = await this.getCurrentSession(user);
        if (!session) {
            session = new UserSession();
            session.user = user;
            session.sessionStart = new Date();
            await session.save();
        }
        return session;
    }

    public static async getCurrentSession(user: User): Promise<UserSession | void> {
        return await UserSession.createQueryBuilder('s')
            .where('s.userId = :userId and sessionEnd is NULL', {userId: user.id})
            .getOne();
    }

    public async endSession() {
        this.sessionEnd = new Date();
        await this.save();
    }
}