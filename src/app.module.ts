import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {ConfigModule} from "@nestjs/config";
import {TypeOrmModule} from "@nestjs/typeorm";
import { ApplicationController } from './controllers/application.controller';
import { Authentication } from './lib/Authentication';
import { AuthenticationMiddleware } from './lib/Authentication.middleware';
import { OrganizationController } from './controllers/organization.controller';
import { LoadOrgMiddleware } from './lib/LoadOrg.middleware';
import { LoadAppMiddleware } from './lib/LoadApp.middleware';
import { UserController } from './controllers/user.controller';
import { PrivilegeController } from './controllers/privilege.controller';
import { PrivilegeDto } from './dtos/privilege.dto';
import { RoleController } from './controllers/role.controller';
import { Authorization } from './lib/Authorization';
import { ApplicationPrivilegeController } from './controllers/applicationPrivilege.controller';
import { ApplicationRoleController } from './controllers/applicationRole.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['../.env'],
      isGlobal: true,
  }),
  TypeOrmModule.forRoot(),
  ],
  controllers: [
    AppController, 
    ApplicationController,
    OrganizationController,
    UserController,
    PrivilegeController,
    RoleController,
    ApplicationPrivilegeController,
    ApplicationRoleController,
  ],
  providers: [AppService, Authentication, Authorization],
})
export class AppModule {
  async configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthenticationMiddleware)
    .forRoutes({path: "*", method: RequestMethod.ALL})

    consumer.apply(LoadAppMiddleware)
    .forRoutes(
      ApplicationPrivilegeController,
      ApplicationRoleController,
    )


    consumer.apply(LoadOrgMiddleware)
    .forRoutes(
      OrganizationController, 
      ApplicationController, 
      UserController, 
      PrivilegeController, 
      RoleController
    );
  }
}
