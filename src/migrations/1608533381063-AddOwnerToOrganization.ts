import {MigrationInterface, QueryRunner} from "typeorm";

export class AddOwnerToOrganization1608533381063 implements MigrationInterface {
    name = 'AddOwnerToOrganization1608533381063'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `organization` ADD `ownerId` varchar(36) NULL");
        await queryRunner.query("ALTER TABLE `organization` ADD CONSTRAINT `FK_67c515257c7a4bc221bb1857a39` FOREIGN KEY (`ownerId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `organization` DROP FOREIGN KEY `FK_67c515257c7a4bc221bb1857a39`");
        await queryRunner.query("ALTER TABLE `organization` DROP COLUMN `ownerId`");
    }

}
