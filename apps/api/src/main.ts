import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ISecretService } from '@iot-framework/core';
import { buildSwagger } from './utils/swagger/builder';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const secretService = app.get(ISecretService);

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const url = secretService.API_GATEWAY_HOST;
  const port = secretService.API_GATEWAY_PORT;

  app.use(cookieParser());
  app.enableCors({
    origin: true,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  buildSwagger(app);
  await app.listen(port);

  Logger.log(`🚀 Application is running on: http://${url}:${port}/${globalPrefix}`);
}

bootstrap();
