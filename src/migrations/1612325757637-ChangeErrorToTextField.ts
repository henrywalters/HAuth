import {MigrationInterface, QueryRunner} from "typeorm";

export class ChangeErrorToTextField1612325757637 implements MigrationInterface {
    name = 'ChangeErrorToTextField1612325757637'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `request_log` MODIFY COLUMN `error` text NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `request_log` MODIFY COLUMN `error` varchar(255) NULL");
    }

}
