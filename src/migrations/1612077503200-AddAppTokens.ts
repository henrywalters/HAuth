import {MigrationInterface, QueryRunner} from "typeorm";

export class AddAppTokens1612077503200 implements MigrationInterface {
    name = 'AddAppTokens1612077503200'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `app_token` (`id` varchar(36) NOT NULL, `name` varchar(255) NOT NULL, `token` varchar(255) NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `expiresOn` date NULL, `applicationId` varchar(36) NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `request_log` ADD `blocked` tinyint NOT NULL DEFAULT 0");
        await queryRunner.query("ALTER TABLE `request_log` ADD `error` varchar(255) NULL");
        await queryRunner.query("ALTER TABLE `request_log` ADD `appTokenId` varchar(36) NULL");
        await queryRunner.query("ALTER TABLE `app_token` ADD CONSTRAINT `FK_a433e884ec1b26e6a3d7e369b9a` FOREIGN KEY (`applicationId`) REFERENCES `application`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `request_log` ADD CONSTRAINT `FK_cbe0e1fc4798353012e00763d49` FOREIGN KEY (`appTokenId`) REFERENCES `app_token`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `request_log` DROP FOREIGN KEY `FK_cbe0e1fc4798353012e00763d49`");
        await queryRunner.query("ALTER TABLE `app_token` DROP FOREIGN KEY `FK_a433e884ec1b26e6a3d7e369b9a`");
        await queryRunner.query("ALTER TABLE `request_log` DROP COLUMN `appTokenId`");
        await queryRunner.query("ALTER TABLE `request_log` DROP COLUMN `error`");
        await queryRunner.query("ALTER TABLE `request_log` DROP COLUMN `blocked`");
        await queryRunner.query("DROP TABLE `app_token`");
    }

}
