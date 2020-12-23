import {MigrationInterface, QueryRunner} from "typeorm";

export class FixMigration1608619806812 implements MigrationInterface {
    name = 'FixMigration1608619806812'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `application_roles` DROP FOREIGN KEY `FK_153d1611aa10858e7ba637649c0`");
        await queryRunner.query("ALTER TABLE `application_privileges` DROP FOREIGN KEY `FK_70a604920905c5fd77e29b98372`");
        await queryRunner.query("DROP INDEX `IDX_153d1611aa10858e7ba637649c` ON `application_roles`");
        await queryRunner.query("DROP INDEX `IDX_70a604920905c5fd77e29b9837` ON `application_privileges`");
        await queryRunner.query("CREATE TABLE `organization_roles` (`organizationId` varchar(36) NOT NULL, `roleId` varchar(36) NOT NULL, INDEX `IDX_c593237ad2c7ae8e05a71fba9a` (`organizationId`), INDEX `IDX_ca42f22fb7ca4ad57e1105af91` (`roleId`), PRIMARY KEY (`organizationId`, `roleId`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `organization_privileges` (`organizationId` varchar(36) NOT NULL, `privilegeId` varchar(36) NOT NULL, INDEX `IDX_1eaac4cdeeef5bab875c44b295` (`organizationId`), INDEX `IDX_c65c696a3571407295a56bf14d` (`privilegeId`), PRIMARY KEY (`organizationId`, `privilegeId`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `application_roles` DROP COLUMN `organizationId`");
        await queryRunner.query("ALTER TABLE `application_privileges` DROP COLUMN `organizationId`");
        await queryRunner.query("ALTER TABLE `organization_roles` ADD CONSTRAINT `FK_c593237ad2c7ae8e05a71fba9a2` FOREIGN KEY (`organizationId`) REFERENCES `organization`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `organization_roles` ADD CONSTRAINT `FK_ca42f22fb7ca4ad57e1105af91a` FOREIGN KEY (`roleId`) REFERENCES `role`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `organization_privileges` ADD CONSTRAINT `FK_1eaac4cdeeef5bab875c44b2953` FOREIGN KEY (`organizationId`) REFERENCES `organization`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `organization_privileges` ADD CONSTRAINT `FK_c65c696a3571407295a56bf14de` FOREIGN KEY (`privilegeId`) REFERENCES `privilege`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `organization_privileges` DROP FOREIGN KEY `FK_c65c696a3571407295a56bf14de`");
        await queryRunner.query("ALTER TABLE `organization_privileges` DROP FOREIGN KEY `FK_1eaac4cdeeef5bab875c44b2953`");
        await queryRunner.query("ALTER TABLE `organization_roles` DROP FOREIGN KEY `FK_ca42f22fb7ca4ad57e1105af91a`");
        await queryRunner.query("ALTER TABLE `organization_roles` DROP FOREIGN KEY `FK_c593237ad2c7ae8e05a71fba9a2`");
        await queryRunner.query("ALTER TABLE `application_privileges` ADD `organizationId` varchar(36) NOT NULL");
        await queryRunner.query("ALTER TABLE `application_roles` ADD `organizationId` varchar(36) NOT NULL");
        await queryRunner.query("DROP INDEX `IDX_c65c696a3571407295a56bf14d` ON `organization_privileges`");
        await queryRunner.query("DROP INDEX `IDX_1eaac4cdeeef5bab875c44b295` ON `organization_privileges`");
        await queryRunner.query("DROP TABLE `organization_privileges`");
        await queryRunner.query("DROP INDEX `IDX_ca42f22fb7ca4ad57e1105af91` ON `organization_roles`");
        await queryRunner.query("DROP INDEX `IDX_c593237ad2c7ae8e05a71fba9a` ON `organization_roles`");
        await queryRunner.query("DROP TABLE `organization_roles`");
        await queryRunner.query("CREATE INDEX `IDX_70a604920905c5fd77e29b9837` ON `application_privileges` (`organizationId`)");
        await queryRunner.query("CREATE INDEX `IDX_153d1611aa10858e7ba637649c` ON `application_roles` (`organizationId`)");
        await queryRunner.query("ALTER TABLE `application_privileges` ADD CONSTRAINT `FK_70a604920905c5fd77e29b98372` FOREIGN KEY (`organizationId`) REFERENCES `organization`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `application_roles` ADD CONSTRAINT `FK_153d1611aa10858e7ba637649c0` FOREIGN KEY (`organizationId`) REFERENCES `organization`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
    }

}
