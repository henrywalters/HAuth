import {MigrationInterface, QueryRunner} from "typeorm";

export class AddUserAppPrivilegesAndRoles1610854920626 implements MigrationInterface {
    name = 'AddUserAppPrivilegesAndRoles1610854920626'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `user_application_roles` (`userId` varchar(36) NOT NULL, `roleId` varchar(36) NOT NULL, INDEX `IDX_8fb19c1aa3ad6659a24df13d85` (`userId`), INDEX `IDX_f6030a251666a03fb577fcf605` (`roleId`), PRIMARY KEY (`userId`, `roleId`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `user_application_privileges` (`userId` varchar(36) NOT NULL, `privilegeId` varchar(36) NOT NULL, INDEX `IDX_fd74ad97e6e35f70c5cfaa2f8e` (`userId`), INDEX `IDX_019ec0cd3e2ccc993736fee9dc` (`privilegeId`), PRIMARY KEY (`userId`, `privilegeId`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `user_application_roles` ADD CONSTRAINT `FK_8fb19c1aa3ad6659a24df13d859` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `user_application_roles` ADD CONSTRAINT `FK_f6030a251666a03fb577fcf6057` FOREIGN KEY (`roleId`) REFERENCES `role`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `user_application_privileges` ADD CONSTRAINT `FK_fd74ad97e6e35f70c5cfaa2f8ea` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `user_application_privileges` ADD CONSTRAINT `FK_019ec0cd3e2ccc993736fee9dc5` FOREIGN KEY (`privilegeId`) REFERENCES `privilege`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `user_application_privileges` DROP FOREIGN KEY `FK_019ec0cd3e2ccc993736fee9dc5`");
        await queryRunner.query("ALTER TABLE `user_application_privileges` DROP FOREIGN KEY `FK_fd74ad97e6e35f70c5cfaa2f8ea`");
        await queryRunner.query("ALTER TABLE `user_application_roles` DROP FOREIGN KEY `FK_f6030a251666a03fb577fcf6057`");
        await queryRunner.query("ALTER TABLE `user_application_roles` DROP FOREIGN KEY `FK_8fb19c1aa3ad6659a24df13d859`");
        await queryRunner.query("DROP INDEX `IDX_019ec0cd3e2ccc993736fee9dc` ON `user_application_privileges`");
        await queryRunner.query("DROP INDEX `IDX_fd74ad97e6e35f70c5cfaa2f8e` ON `user_application_privileges`");
        await queryRunner.query("DROP TABLE `user_application_privileges`");
        await queryRunner.query("DROP INDEX `IDX_f6030a251666a03fb577fcf605` ON `user_application_roles`");
        await queryRunner.query("DROP INDEX `IDX_8fb19c1aa3ad6659a24df13d85` ON `user_application_roles`");
        await queryRunner.query("DROP TABLE `user_application_roles`");
    }

}
