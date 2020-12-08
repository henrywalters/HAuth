import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {ConfigModule} from "@nestjs/config";
import {TypeOrmModule} from "@nestjs/typeorm";
import { ApplicationController } from './controllers/application.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['../.env'],
      isGlobal: true,
  }),
  TypeOrmModule.forRoot(),
  ],
  controllers: [AppController, ApplicationController],
  providers: [AppService],
})
export class AppModule {}
