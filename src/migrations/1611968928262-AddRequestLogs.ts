import {MigrationInterface, QueryRunner} from "typeorm";

export class AddRequestLogs1611968928262 implements MigrationInterface {
    name = 'AddRequestLogs1611968928262'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `device_log` (`id` varchar(36) NOT NULL, `clientType` varchar(255) NOT NULL, `clientName` varchar(255) NOT NULL, `clientVersion` varchar(255) NOT NULL, `osName` varchar(255) NOT NULL, `osVersion` varchar(255) NOT NULL, `osPlatform` varchar(255) NOT NULL, `deviceType` varchar(255) NOT NULL, `deviceBrand` varchar(255) NOT NULL, `deviceModel` varchar(255) NOT NULL, `requestLogId` varchar(36) NULL, UNIQUE INDEX `REL_0ea250c4acd0fb1325c3e22f27` (`requestLogId`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `request_log` (`id` varchar(36) NOT NULL, `timestamp` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `ip` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `bot_log` (`id` varchar(36) NOT NULL, `name` varchar(255) NOT NULL, `category` varchar(255) NOT NULL, `url` varchar(255) NOT NULL, `producerName` varchar(255) NOT NULL, `producerUrl` varchar(255) NOT NULL, `requestLogId` varchar(36) NULL, UNIQUE INDEX `REL_d7aa493a0c39719c0c52dc4b76` (`requestLogId`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `device_log` ADD CONSTRAINT `FK_0ea250c4acd0fb1325c3e22f27b` FOREIGN KEY (`requestLogId`) REFERENCES `request_log`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `bot_log` ADD CONSTRAINT `FK_d7aa493a0c39719c0c52dc4b764` FOREIGN KEY (`requestLogId`) REFERENCES `request_log`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `bot_log` DROP FOREIGN KEY `FK_d7aa493a0c39719c0c52dc4b764`");
        await queryRunner.query("ALTER TABLE `device_log` DROP FOREIGN KEY `FK_0ea250c4acd0fb1325c3e22f27b`");
        await queryRunner.query("DROP INDEX `REL_d7aa493a0c39719c0c52dc4b76` ON `bot_log`");
        await queryRunner.query("DROP TABLE `bot_log`");
        await queryRunner.query("DROP TABLE `request_log`");
        await queryRunner.query("DROP INDEX `REL_0ea250c4acd0fb1325c3e22f27` ON `device_log`");
        await queryRunner.query("DROP TABLE `device_log`");
    }

}
