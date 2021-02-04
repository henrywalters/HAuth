import {MigrationInterface, QueryRunner} from "typeorm";

export class AddUserSessions1611982849234 implements MigrationInterface {
    name = 'AddUserSessions1611982849234'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `user_session` (`id` varchar(36) NOT NULL, `sessionStart` timestamp NOT NULL, `sessionEnd` timestamp NULL, `userId` varchar(36) NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `request_log` ADD `userId` varchar(36) NULL");
        await queryRunner.query("ALTER TABLE `request_log` ADD CONSTRAINT `FK_7d3105361ee3cc9df1bfeefc1f1` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `user_session` ADD CONSTRAINT `FK_b5eb7aa08382591e7c2d1244fe5` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `user_session` DROP FOREIGN KEY `FK_b5eb7aa08382591e7c2d1244fe5`");
        await queryRunner.query("ALTER TABLE `request_log` DROP FOREIGN KEY `FK_7d3105361ee3cc9df1bfeefc1f1`");
        await queryRunner.query("ALTER TABLE `request_log` DROP COLUMN `userId`");
        await queryRunner.query("DROP TABLE `user_session`");
    }

}
