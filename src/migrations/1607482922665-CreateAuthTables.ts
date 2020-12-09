import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateAuthTables1607482922665 implements MigrationInterface {
    name = 'CreateAuthTables1607482922665'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `privilege` (`id` varchar(36) NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `deletedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `locked` tinyint NOT NULL DEFAULT 0, `name` varchar(255) NOT NULL, `applicationId` varchar(36) NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `role` (`id` varchar(36) NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `deletedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `locked` tinyint NOT NULL DEFAULT 0, `name` varchar(255) NOT NULL, `applicationId` varchar(36) NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `client` (`id` varchar(36) NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `deletedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `name` varchar(255) NOT NULL, `key` varchar(255) NOT NULL, `secret` varchar(255) NOT NULL, `applicationId` varchar(36) NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `application` (`id` varchar(36) NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `deletedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `name` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `user` (`id` varchar(36) NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `deletedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `name` varchar(255) NOT NULL, `email` varchar(255) NOT NULL, `thumbnailUrl` varchar(255) NOT NULL, `authType` enum ('Standard', 'Google') NOT NULL, `password` varchar(255) NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `privileges_allowed_to_enable` (`privilegeId_1` varchar(36) NOT NULL, `privilegeId_2` varchar(36) NOT NULL, INDEX `IDX_72122aeea38ef3639723ad30d7` (`privilegeId_1`), INDEX `IDX_7614ffa69dc39f22cc7e74a844` (`privilegeId_2`), PRIMARY KEY (`privilegeId_1`, `privilegeId_2`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `role_privileges` (`roleId` varchar(36) NOT NULL, `privilegeId` varchar(36) NOT NULL, INDEX `IDX_bd85ed2d30028498f2fa5f1835` (`roleId`), INDEX `IDX_039c24fec2d606f399cd507d6f` (`privilegeId`), PRIMARY KEY (`roleId`, `privilegeId`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `client_roles` (`clientId` varchar(36) NOT NULL, `roleId` varchar(36) NOT NULL, INDEX `IDX_48ac36b901f6e9c39203c9ebd5` (`clientId`), INDEX `IDX_700012c7e77dcef5175421c42d` (`roleId`), PRIMARY KEY (`clientId`, `roleId`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `client_privileges` (`clientId` varchar(36) NOT NULL, `privilegeId` varchar(36) NOT NULL, INDEX `IDX_607a699d0f18b583844abc05d6` (`clientId`), INDEX `IDX_67a799d59962e0a4733e0b0750` (`privilegeId`), PRIMARY KEY (`clientId`, `privilegeId`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `user_roles` (`userId` varchar(36) NOT NULL, `roleId` varchar(36) NOT NULL, INDEX `IDX_472b25323af01488f1f66a06b6` (`userId`), INDEX `IDX_86033897c009fcca8b6505d6be` (`roleId`), PRIMARY KEY (`userId`, `roleId`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `user_privileges` (`userId` varchar(36) NOT NULL, `privilegeId` varchar(36) NOT NULL, INDEX `IDX_245ff8891fafc3d83a2e8166c6` (`userId`), INDEX `IDX_d4d921a0fb4eddc3aea3dadebd` (`privilegeId`), PRIMARY KEY (`userId`, `privilegeId`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `privilege` ADD CONSTRAINT `FK_6aca0bcbeff364e21255b1e6bb4` FOREIGN KEY (`applicationId`) REFERENCES `application`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `role` ADD CONSTRAINT `FK_7f3b96f15aaf5a27549288d264b` FOREIGN KEY (`applicationId`) REFERENCES `application`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `client` ADD CONSTRAINT `FK_406a4150d8b8cca8051f1d0c771` FOREIGN KEY (`applicationId`) REFERENCES `application`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `privileges_allowed_to_enable` ADD CONSTRAINT `FK_72122aeea38ef3639723ad30d7e` FOREIGN KEY (`privilegeId_1`) REFERENCES `privilege`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `privileges_allowed_to_enable` ADD CONSTRAINT `FK_7614ffa69dc39f22cc7e74a8449` FOREIGN KEY (`privilegeId_2`) REFERENCES `privilege`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `role_privileges` ADD CONSTRAINT `FK_bd85ed2d30028498f2fa5f18355` FOREIGN KEY (`roleId`) REFERENCES `role`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `role_privileges` ADD CONSTRAINT `FK_039c24fec2d606f399cd507d6f9` FOREIGN KEY (`privilegeId`) REFERENCES `privilege`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `client_roles` ADD CONSTRAINT `FK_48ac36b901f6e9c39203c9ebd57` FOREIGN KEY (`clientId`) REFERENCES `client`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `client_roles` ADD CONSTRAINT `FK_700012c7e77dcef5175421c42da` FOREIGN KEY (`roleId`) REFERENCES `role`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `client_privileges` ADD CONSTRAINT `FK_607a699d0f18b583844abc05d60` FOREIGN KEY (`clientId`) REFERENCES `client`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `client_privileges` ADD CONSTRAINT `FK_67a799d59962e0a4733e0b07506` FOREIGN KEY (`privilegeId`) REFERENCES `privilege`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `user_roles` ADD CONSTRAINT `FK_472b25323af01488f1f66a06b67` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `user_roles` ADD CONSTRAINT `FK_86033897c009fcca8b6505d6be2` FOREIGN KEY (`roleId`) REFERENCES `role`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `user_privileges` ADD CONSTRAINT `FK_245ff8891fafc3d83a2e8166c61` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `user_privileges` ADD CONSTRAINT `FK_d4d921a0fb4eddc3aea3dadebdd` FOREIGN KEY (`privilegeId`) REFERENCES `privilege`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `user_privileges` DROP FOREIGN KEY `FK_d4d921a0fb4eddc3aea3dadebdd`");
        await queryRunner.query("ALTER TABLE `user_privileges` DROP FOREIGN KEY `FK_245ff8891fafc3d83a2e8166c61`");
        await queryRunner.query("ALTER TABLE `user_roles` DROP FOREIGN KEY `FK_86033897c009fcca8b6505d6be2`");
        await queryRunner.query("ALTER TABLE `user_roles` DROP FOREIGN KEY `FK_472b25323af01488f1f66a06b67`");
        await queryRunner.query("ALTER TABLE `client_privileges` DROP FOREIGN KEY `FK_67a799d59962e0a4733e0b07506`");
        await queryRunner.query("ALTER TABLE `client_privileges` DROP FOREIGN KEY `FK_607a699d0f18b583844abc05d60`");
        await queryRunner.query("ALTER TABLE `client_roles` DROP FOREIGN KEY `FK_700012c7e77dcef5175421c42da`");
        await queryRunner.query("ALTER TABLE `client_roles` DROP FOREIGN KEY `FK_48ac36b901f6e9c39203c9ebd57`");
        await queryRunner.query("ALTER TABLE `role_privileges` DROP FOREIGN KEY `FK_039c24fec2d606f399cd507d6f9`");
        await queryRunner.query("ALTER TABLE `role_privileges` DROP FOREIGN KEY `FK_bd85ed2d30028498f2fa5f18355`");
        await queryRunner.query("ALTER TABLE `privileges_allowed_to_enable` DROP FOREIGN KEY `FK_7614ffa69dc39f22cc7e74a8449`");
        await queryRunner.query("ALTER TABLE `privileges_allowed_to_enable` DROP FOREIGN KEY `FK_72122aeea38ef3639723ad30d7e`");
        await queryRunner.query("ALTER TABLE `client` DROP FOREIGN KEY `FK_406a4150d8b8cca8051f1d0c771`");
        await queryRunner.query("ALTER TABLE `role` DROP FOREIGN KEY `FK_7f3b96f15aaf5a27549288d264b`");
        await queryRunner.query("ALTER TABLE `privilege` DROP FOREIGN KEY `FK_6aca0bcbeff364e21255b1e6bb4`");
        await queryRunner.query("DROP INDEX `IDX_d4d921a0fb4eddc3aea3dadebd` ON `user_privileges`");
        await queryRunner.query("DROP INDEX `IDX_245ff8891fafc3d83a2e8166c6` ON `user_privileges`");
        await queryRunner.query("DROP TABLE `user_privileges`");
        await queryRunner.query("DROP INDEX `IDX_86033897c009fcca8b6505d6be` ON `user_roles`");
        await queryRunner.query("DROP INDEX `IDX_472b25323af01488f1f66a06b6` ON `user_roles`");
        await queryRunner.query("DROP TABLE `user_roles`");
        await queryRunner.query("DROP INDEX `IDX_67a799d59962e0a4733e0b0750` ON `client_privileges`");
        await queryRunner.query("DROP INDEX `IDX_607a699d0f18b583844abc05d6` ON `client_privileges`");
        await queryRunner.query("DROP TABLE `client_privileges`");
        await queryRunner.query("DROP INDEX `IDX_700012c7e77dcef5175421c42d` ON `client_roles`");
        await queryRunner.query("DROP INDEX `IDX_48ac36b901f6e9c39203c9ebd5` ON `client_roles`");
        await queryRunner.query("DROP TABLE `client_roles`");
        await queryRunner.query("DROP INDEX `IDX_039c24fec2d606f399cd507d6f` ON `role_privileges`");
        await queryRunner.query("DROP INDEX `IDX_bd85ed2d30028498f2fa5f1835` ON `role_privileges`");
        await queryRunner.query("DROP TABLE `role_privileges`");
        await queryRunner.query("DROP INDEX `IDX_7614ffa69dc39f22cc7e74a844` ON `privileges_allowed_to_enable`");
        await queryRunner.query("DROP INDEX `IDX_72122aeea38ef3639723ad30d7` ON `privileges_allowed_to_enable`");
        await queryRunner.query("DROP TABLE `privileges_allowed_to_enable`");
        await queryRunner.query("DROP TABLE `user`");
        await queryRunner.query("DROP TABLE `application`");
        await queryRunner.query("DROP TABLE `client`");
        await queryRunner.query("DROP TABLE `role`");
        await queryRunner.query("DROP TABLE `privilege`");
    }

}
