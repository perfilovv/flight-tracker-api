import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from './config/env.config';
import { ValidationPipe } from '@nestjs/common';
import { AppErrorFilter } from './shared/errors/error.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new AppErrorFilter());
  await app.listen(config.port ?? 3000);
}
bootstrap();
