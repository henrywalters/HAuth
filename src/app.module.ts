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

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['../.env'],
      isGlobal: true,
  }),
  TypeOrmModule.forRoot(),
  ],
  controllers: [AppController, ApplicationController, OrganizationController],
  providers: [AppService, Authentication],
})
export class AppModule {
  async configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthenticationMiddleware)
    .forRoutes({path: "*", method: RequestMethod.ALL})

    consumer.apply(LoadOrgMiddleware)
    .forRoutes(OrganizationController);
  }
}
