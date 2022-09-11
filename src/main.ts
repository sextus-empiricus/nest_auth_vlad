import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appConfig } from '../config';
import { ValidationPipe } from '@nestjs/common';
import { AccessTokenGuard } from './guards';

async function bootstrap() {
   const { port } = appConfig.app;
   const app = await NestFactory.create(AppModule);
   app.useGlobalPipes(new ValidationPipe({}));
   await app.listen(port || 3001);
}

bootstrap();
