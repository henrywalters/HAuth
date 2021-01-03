import {MigrationInterface, QueryRunner} from "typeorm";

export class RefactorPrivelegeRoleRelationships1609632309724 implements MigrationInterface {
    name = 'RefactorPrivelegeRoleRelationships1609632309724'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `role` ADD `organizationId` varchar(36) NULL");
        await queryRunner.query("ALTER TABLE `privilege` ADD `organizationId` varchar(36) NULL");
        await queryRunner.query("ALTER TABLE `privilege` ADD `applicationId` varchar(36) NULL");
        await queryRunner.query("ALTER TABLE `role` ADD CONSTRAINT `FK_2bcd50772082305f3bcee6b6da4` FOREIGN KEY (`organizationId`) REFERENCES `organization`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `privilege` ADD CONSTRAINT `FK_ac33b8cd03db0c5f1f45699f639` FOREIGN KEY (`organizationId`) REFERENCES `organization`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `privilege` ADD CONSTRAINT `FK_6aca0bcbeff364e21255b1e6bb4` FOREIGN KEY (`applicationId`) REFERENCES `application`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `privilege` DROP FOREIGN KEY `FK_6aca0bcbeff364e21255b1e6bb4`");
        await queryRunner.query("ALTER TABLE `privilege` DROP FOREIGN KEY `FK_ac33b8cd03db0c5f1f45699f639`");
        await queryRunner.query("ALTER TABLE `role` DROP FOREIGN KEY `FK_2bcd50772082305f3bcee6b6da4`");
        await queryRunner.query("ALTER TABLE `privilege` DROP COLUMN `applicationId`");
        await queryRunner.query("ALTER TABLE `privilege` DROP COLUMN `organizationId`");
        await queryRunner.query("ALTER TABLE `role` DROP COLUMN `organizationId`");
    }

}
