import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ISecretService } from '@iot-framework/core';
import { buildSwagger } from './utils/swagger/builder';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const secretService = app.get(ISecretService);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.MQTT,
    options: {
      url: secretService.MQTT_BROKER_URL,
    },
  });

  const globalPrefix = 'device';
  app.setGlobalPrefix(globalPrefix);

  const port = secretService.DEVICE_MS_PORT;
  const url = secretService.DEVICE_MS_HOST;

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  buildSwagger(app);
  await app.startAllMicroservices();
  await app.listen(port);

  Logger.log(
    `🚀 Application is ${process.env.NODE_ENV} running ${url} on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
