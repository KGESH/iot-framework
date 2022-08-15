import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ISecretService } from '@iot-framework/core';
import { buildSwagger } from './utils/swagger/builder';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const secretService = app.get(ISecretService);

  const globalPrefix = 'user';
  app.setGlobalPrefix(globalPrefix);

  const url = secretService.USER_MS_URL;
  const port = secretService.USER_MS_PORT;

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  buildSwagger(app);
  await app.listen(port);

  Logger.log(
    `🚀 Application is ${process.env.NODE_ENV} running ${url} on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
