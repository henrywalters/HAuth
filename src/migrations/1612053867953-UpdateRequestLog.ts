import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateRequestLog1612053867953 implements MigrationInterface {
    name = 'UpdateRequestLog1612053867953'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `request_log` ADD `url` varchar(255) NOT NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `request_log` DROP COLUMN `url`");
    }

}
