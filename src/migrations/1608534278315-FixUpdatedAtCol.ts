import {MigrationInterface, QueryRunner} from "typeorm";

export class FixUpdatedAtCol1608534278315 implements MigrationInterface {
    name = 'FixUpdatedAtCol1608534278315'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `privilege` CHANGE `deletedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)");
        await queryRunner.query("ALTER TABLE `role` CHANGE `deletedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)");
        await queryRunner.query("ALTER TABLE `client` CHANGE `deletedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)");
        await queryRunner.query("ALTER TABLE `user` CHANGE `deletedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)");
        await queryRunner.query("ALTER TABLE `organization` CHANGE `deletedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)");
        await queryRunner.query("ALTER TABLE `application` CHANGE `deletedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `application` CHANGE `updatedAt` `deletedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)");
        await queryRunner.query("ALTER TABLE `organization` CHANGE `updatedAt` `deletedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)");
        await queryRunner.query("ALTER TABLE `user` CHANGE `updatedAt` `deletedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)");
        await queryRunner.query("ALTER TABLE `client` CHANGE `updatedAt` `deletedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)");
        await queryRunner.query("ALTER TABLE `role` CHANGE `updatedAt` `deletedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)");
        await queryRunner.query("ALTER TABLE `privilege` CHANGE `updatedAt` `deletedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)");
    }

}
