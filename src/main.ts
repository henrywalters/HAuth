import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './http-exception.filter';
import { AuthenticationMiddleware } from './lib/Authentication.middleware';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
  )

  const options = new DocumentBuilder()
    .setTitle('Hauth')
    .setDescription('fast and simple authentication and authorization for businesses')
    .setVersion('1.0')
    .addTag('hauth')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('v1/docs', app, document);

  app.enableCors();

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());

  app.useStaticAssets(join(__dirname, '..', 'public'))
  app.setBaseViewsDir(join(__dirname, '..', 'views'))
  app.setViewEngine('hbs');
  
  await app.listen(3000);
}
bootstrap();
