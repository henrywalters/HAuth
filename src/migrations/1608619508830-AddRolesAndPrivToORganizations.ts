import {MigrationInterface, QueryRunner} from "typeorm";

export class AddRolesAndPrivToORganizations1608619508830 implements MigrationInterface {
    name = 'AddRolesAndPrivToORganizations1608619508830'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `privilege` DROP FOREIGN KEY `FK_6aca0bcbeff364e21255b1e6bb4`");
        await queryRunner.query("CREATE TABLE `application_roles` (`organizationId` varchar(36) NOT NULL, `roleId` varchar(36) NOT NULL, INDEX `IDX_153d1611aa10858e7ba637649c` (`organizationId`), INDEX `IDX_e15f78822ade1b6328fc262bf2` (`roleId`), PRIMARY KEY (`organizationId`, `roleId`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `application_privileges` (`organizationId` varchar(36) NOT NULL, `privilegeId` varchar(36) NOT NULL, INDEX `IDX_70a604920905c5fd77e29b9837` (`organizationId`), INDEX `IDX_b4617a164cc328f24611dc50d8` (`privilegeId`), PRIMARY KEY (`organizationId`, `privilegeId`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `privilege` DROP COLUMN `applicationId`");
        await queryRunner.query("ALTER TABLE `application_roles` DROP PRIMARY KEY");
        await queryRunner.query("ALTER TABLE `application_roles` ADD PRIMARY KEY (`roleId`)");
        await queryRunner.query("DROP INDEX `IDX_153d1611aa10858e7ba637649c` ON `application_roles`");
        await queryRunner.query("ALTER TABLE `application_roles` DROP COLUMN `organizationId`");
        await queryRunner.query("ALTER TABLE `application_privileges` DROP PRIMARY KEY");
        await queryRunner.query("ALTER TABLE `application_privileges` ADD PRIMARY KEY (`privilegeId`)");
        await queryRunner.query("DROP INDEX `IDX_70a604920905c5fd77e29b9837` ON `application_privileges`");
        await queryRunner.query("ALTER TABLE `application_privileges` DROP COLUMN `organizationId`");
        await queryRunner.query("ALTER TABLE `application_roles` ADD `organizationId` varchar(36) NOT NULL");
        await queryRunner.query("ALTER TABLE `application_roles` DROP PRIMARY KEY");
        await queryRunner.query("ALTER TABLE `application_roles` ADD PRIMARY KEY (`roleId`, `organizationId`)");
        await queryRunner.query("ALTER TABLE `application_privileges` ADD `organizationId` varchar(36) NOT NULL");
        await queryRunner.query("ALTER TABLE `application_privileges` DROP PRIMARY KEY");
        await queryRunner.query("ALTER TABLE `application_privileges` ADD PRIMARY KEY (`privilegeId`, `organizationId`)");
        await queryRunner.query("ALTER TABLE `application_roles` ADD `applicationId` varchar(36) NOT NULL");
        await queryRunner.query("ALTER TABLE `application_roles` DROP PRIMARY KEY");
        await queryRunner.query("ALTER TABLE `application_roles` ADD PRIMARY KEY (`roleId`, `organizationId`, `applicationId`)");
        await queryRunner.query("ALTER TABLE `application_privileges` ADD `applicationId` varchar(36) NOT NULL");
        await queryRunner.query("ALTER TABLE `application_privileges` DROP PRIMARY KEY");
        await queryRunner.query("ALTER TABLE `application_privileges` ADD PRIMARY KEY (`privilegeId`, `organizationId`, `applicationId`)");
        await queryRunner.query("ALTER TABLE `application_roles` DROP PRIMARY KEY");
        await queryRunner.query("ALTER TABLE `application_roles` ADD PRIMARY KEY (`organizationId`, `roleId`)");
        await queryRunner.query("ALTER TABLE `application_privileges` DROP PRIMARY KEY");
        await queryRunner.query("ALTER TABLE `application_privileges` ADD PRIMARY KEY (`organizationId`, `privilegeId`)");
        await queryRunner.query("ALTER TABLE `application_roles` DROP PRIMARY KEY");
        await queryRunner.query("ALTER TABLE `application_roles` ADD PRIMARY KEY (`applicationId`, `roleId`)");
        await queryRunner.query("ALTER TABLE `application_privileges` DROP PRIMARY KEY");
        await queryRunner.query("ALTER TABLE `application_privileges` ADD PRIMARY KEY (`applicationId`, `privilegeId`)");
        await queryRunner.query("CREATE INDEX `IDX_153d1611aa10858e7ba637649c` ON `application_roles` (`organizationId`)");
        await queryRunner.query("CREATE INDEX `IDX_70a604920905c5fd77e29b9837` ON `application_privileges` (`organizationId`)");
        await queryRunner.query("CREATE INDEX `IDX_62963b3faeb871243fbcae3867` ON `application_roles` (`applicationId`)");
        await queryRunner.query("CREATE INDEX `IDX_33caff154476703fcb5d678640` ON `application_privileges` (`applicationId`)");
        await queryRunner.query("ALTER TABLE `application_roles` ADD CONSTRAINT `FK_153d1611aa10858e7ba637649c0` FOREIGN KEY (`organizationId`) REFERENCES `organization`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `application_roles` ADD CONSTRAINT `FK_e15f78822ade1b6328fc262bf20` FOREIGN KEY (`roleId`) REFERENCES `role`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `application_privileges` ADD CONSTRAINT `FK_70a604920905c5fd77e29b98372` FOREIGN KEY (`organizationId`) REFERENCES `organization`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `application_privileges` ADD CONSTRAINT `FK_b4617a164cc328f24611dc50d8a` FOREIGN KEY (`privilegeId`) REFERENCES `privilege`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `application_roles` ADD CONSTRAINT `FK_62963b3faeb871243fbcae3867b` FOREIGN KEY (`applicationId`) REFERENCES `application`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `application_privileges` ADD CONSTRAINT `FK_33caff154476703fcb5d678640f` FOREIGN KEY (`applicationId`) REFERENCES `application`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `application_privileges` DROP FOREIGN KEY `FK_33caff154476703fcb5d678640f`");
        await queryRunner.query("ALTER TABLE `application_roles` DROP FOREIGN KEY `FK_62963b3faeb871243fbcae3867b`");
        await queryRunner.query("ALTER TABLE `application_privileges` DROP FOREIGN KEY `FK_b4617a164cc328f24611dc50d8a`");
        await queryRunner.query("ALTER TABLE `application_privileges` DROP FOREIGN KEY `FK_70a604920905c5fd77e29b98372`");
        await queryRunner.query("ALTER TABLE `application_roles` DROP FOREIGN KEY `FK_e15f78822ade1b6328fc262bf20`");
        await queryRunner.query("ALTER TABLE `application_roles` DROP FOREIGN KEY `FK_153d1611aa10858e7ba637649c0`");
        await queryRunner.query("DROP INDEX `IDX_33caff154476703fcb5d678640` ON `application_privileges`");
        await queryRunner.query("DROP INDEX `IDX_62963b3faeb871243fbcae3867` ON `application_roles`");
        await queryRunner.query("DROP INDEX `IDX_70a604920905c5fd77e29b9837` ON `application_privileges`");
        await queryRunner.query("DROP INDEX `IDX_153d1611aa10858e7ba637649c` ON `application_roles`");
        await queryRunner.query("ALTER TABLE `application_privileges` DROP PRIMARY KEY");
        await queryRunner.query("ALTER TABLE `application_privileges` ADD PRIMARY KEY (`privilegeId`, `organizationId`, `applicationId`)");
        await queryRunner.query("ALTER TABLE `application_roles` DROP PRIMARY KEY");
        await queryRunner.query("ALTER TABLE `application_roles` ADD PRIMARY KEY (`roleId`, `organizationId`, `applicationId`)");
        await queryRunner.query("ALTER TABLE `application_privileges` DROP PRIMARY KEY");
        await queryRunner.query("ALTER TABLE `application_privileges` ADD PRIMARY KEY (`privilegeId`, `organizationId`, `applicationId`)");
        await queryRunner.query("ALTER TABLE `application_roles` DROP PRIMARY KEY");
        await queryRunner.query("ALTER TABLE `application_roles` ADD PRIMARY KEY (`roleId`, `organizationId`, `applicationId`)");
        await queryRunner.query("ALTER TABLE `application_privileges` DROP PRIMARY KEY");
        await queryRunner.query("ALTER TABLE `application_privileges` ADD PRIMARY KEY (`privilegeId`, `organizationId`)");
        await queryRunner.query("ALTER TABLE `application_privileges` DROP COLUMN `applicationId`");
        await queryRunner.query("ALTER TABLE `application_roles` DROP PRIMARY KEY");
        await queryRunner.query("ALTER TABLE `application_roles` ADD PRIMARY KEY (`roleId`, `organizationId`)");
        await queryRunner.query("ALTER TABLE `application_roles` DROP COLUMN `applicationId`");
        await queryRunner.query("ALTER TABLE `application_privileges` DROP PRIMARY KEY");
        await queryRunner.query("ALTER TABLE `application_privileges` ADD PRIMARY KEY (`privilegeId`)");
        await queryRunner.query("ALTER TABLE `application_privileges` DROP COLUMN `organizationId`");
        await queryRunner.query("ALTER TABLE `application_roles` DROP PRIMARY KEY");
        await queryRunner.query("ALTER TABLE `application_roles` ADD PRIMARY KEY (`roleId`)");
        await queryRunner.query("ALTER TABLE `application_roles` DROP COLUMN `organizationId`");
        await queryRunner.query("ALTER TABLE `application_privileges` ADD `organizationId` varchar(36) NOT NULL");
        await queryRunner.query("CREATE INDEX `IDX_70a604920905c5fd77e29b9837` ON `application_privileges` (`organizationId`)");
        await queryRunner.query("ALTER TABLE `application_privileges` DROP PRIMARY KEY");
        await queryRunner.query("ALTER TABLE `application_privileges` ADD PRIMARY KEY (`organizationId`, `privilegeId`)");
        await queryRunner.query("ALTER TABLE `application_roles` ADD `organizationId` varchar(36) NOT NULL");
        await queryRunner.query("CREATE INDEX `IDX_153d1611aa10858e7ba637649c` ON `application_roles` (`organizationId`)");
        await queryRunner.query("ALTER TABLE `application_roles` DROP PRIMARY KEY");
        await queryRunner.query("ALTER TABLE `application_roles` ADD PRIMARY KEY (`organizationId`, `roleId`)");
        await queryRunner.query("ALTER TABLE `privilege` ADD `applicationId` varchar(36) NULL");
        await queryRunner.query("DROP INDEX `IDX_b4617a164cc328f24611dc50d8` ON `application_privileges`");
        await queryRunner.query("DROP INDEX `IDX_70a604920905c5fd77e29b9837` ON `application_privileges`");
        await queryRunner.query("DROP TABLE `application_privileges`");
        await queryRunner.query("DROP INDEX `IDX_e15f78822ade1b6328fc262bf2` ON `application_roles`");
        await queryRunner.query("DROP INDEX `IDX_153d1611aa10858e7ba637649c` ON `application_roles`");
        await queryRunner.query("DROP TABLE `application_roles`");
        await queryRunner.query("ALTER TABLE `privilege` ADD CONSTRAINT `FK_6aca0bcbeff364e21255b1e6bb4` FOREIGN KEY (`applicationId`) REFERENCES `application`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

}
