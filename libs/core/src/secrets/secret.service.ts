import { Injectable } from '@nestjs/common';
import { ISecretService } from './adapter';
import { environment } from '@iot-framework/core';

@Injectable()
export class SecretService implements ISecretService {
  /** API Gateway */
  API_GATEWAY_URL_PREFIX = environment.API_GATEWAY_URL_PREFIX;
  API_GATEWAY_HOST = environment.API_GATEWAY_HOST;
  API_GATEWAY_PORT = environment.API_GATEWAY_PORT;
  API_GATEWAY_URL = environment.API_GATEWAY_URL;

  /** Device Microservice */
  DEVICE_MS_URL_PREFIX = environment.DEVICE_MS_URL_PREFIX;
  DEVICE_MS_HOST = environment.DEVICE_MS_HOST;
  DEVICE_MS_PORT = environment.DEVICE_MS_PORT;
  DEVICE_MS_URL = environment.DEVICE_MS_URL;

  /** Device Microservice */
  USER_MS_URL_PREFIX = environment.USER_MS_URL_PREFIX;
  USER_MS_HOST = environment.USER_MS_HOST;
  USER_MS_PORT = environment.USER_MS_PORT;
  USER_MS_URL = environment.USER_MS_URL;

  /** Database */
  DATABASE_TYPE = environment.DATABASE_TYPE;
  DATABASE_HOST = environment.DATABASE_HOST;
  DATABASE_NAME = environment.DATABASE_NAME;
  DATABASE_PASSWORD = environment.DATABASE_PASSWORD;
  DATABASE_PORT = environment.DATABASE_PORT;
  DATABASE_USER = environment.DATABASE_USER;

  /** Cache */
  REDIS_HOST = environment.REDIS_HOST;
  REDIS_PORT = environment.REDIS_PORT;

  /** MQTT Broker */
  MQTT_BROKER_URL = environment.MQTT_BROKER_URL;

  /** JWT Module */
  JWT_ACCESS_SECRET = environment.JWT_ACCESS_SECRET;
  JWT_REFRESH_SECRET = environment.JWT_REFRESH_SECRET;
  JWT_ACCESS_EXPIRES_IN = environment.JWT_ACCESS_EXPIRES_IN;
  JWT_REFRESH_EXPIRES_IN = environment.JWT_REFRESH_EXPIRES_IN;
}
