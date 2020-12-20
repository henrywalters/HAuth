import {MigrationInterface, QueryRunner} from "typeorm";

export class AddedOrganizations1608446677043 implements MigrationInterface {
    name = 'AddedOrganizations1608446677043'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `organization` (`id` varchar(36) NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `deletedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `name` varchar(255) NOT NULL, `domain` varchar(255) NOT NULL, `restrictUsersToDomain` tinyint NOT NULL DEFAULT 0, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `user_organizations` (`userId` varchar(36) NOT NULL, `organizationId` varchar(36) NOT NULL, INDEX `IDX_11d4cd5202bd8914464f4bec37` (`userId`), INDEX `IDX_71997faba4726730e91d514138` (`organizationId`), PRIMARY KEY (`userId`, `organizationId`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `application` ADD `organizationId` varchar(36) NULL");
        await queryRunner.query("ALTER TABLE `user` CHANGE `thumbnailUrl` `thumbnailUrl` varchar(255) NULL");
        await queryRunner.query("ALTER TABLE `application` ADD CONSTRAINT `FK_88e675c3f80602005b728979e4a` FOREIGN KEY (`organizationId`) REFERENCES `organization`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `user_organizations` ADD CONSTRAINT `FK_11d4cd5202bd8914464f4bec379` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `user_organizations` ADD CONSTRAINT `FK_71997faba4726730e91d514138e` FOREIGN KEY (`organizationId`) REFERENCES `organization`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `user_organizations` DROP FOREIGN KEY `FK_71997faba4726730e91d514138e`");
        await queryRunner.query("ALTER TABLE `user_organizations` DROP FOREIGN KEY `FK_11d4cd5202bd8914464f4bec379`");
        await queryRunner.query("ALTER TABLE `application` DROP FOREIGN KEY `FK_88e675c3f80602005b728979e4a`");
        await queryRunner.query("ALTER TABLE `user` CHANGE `thumbnailUrl` `thumbnailUrl` varchar(255) NOT NULL");
        await queryRunner.query("ALTER TABLE `application` DROP COLUMN `organizationId`");
        await queryRunner.query("DROP INDEX `IDX_71997faba4726730e91d514138` ON `user_organizations`");
        await queryRunner.query("DROP INDEX `IDX_11d4cd5202bd8914464f4bec37` ON `user_organizations`");
        await queryRunner.query("DROP TABLE `user_organizations`");
        await queryRunner.query("DROP TABLE `organization`");
    }

}
