import {
  API_GATEWAY_ENV,
  DATABASE_ENV,
  DEVICE_MS_ENV,
  JWT_ENV,
  MQTT_ENV,
  REDIS_ENV,
  USER_MS_ENV,
} from './enum';
import { DatabaseType } from 'typeorm';

export abstract class ISecretService {
  /** API Gateway */
  API_GATEWAY_HOST: API_GATEWAY_ENV.HOST | string;
  API_GATEWAY_PORT: API_GATEWAY_ENV.PORT | string | number;
  API_GATEWAY_URL_PREFIX: API_GATEWAY_ENV.PREFIX | string;

  /** Device Microservice */
  DEVICE_MS_HOST: DEVICE_MS_ENV.HOST | string;
  DEVICE_MS_PORT: DEVICE_MS_ENV.PORT | string | number;
  DEVICE_MS_URL_PREFIX: DEVICE_MS_ENV.PREFIX | string;

  /** User Microservice */
  USER_MS_HOST: USER_MS_ENV.HOST | string;
  USER_MS_PORT: USER_MS_ENV.PORT | string | number;
  USER_MS_URL_PREFIX: USER_MS_ENV.PREFIX | string;

  /** Database */
  DATABASE_TYPE: DATABASE_ENV | DatabaseType | string;
  DATABASE_HOST: DATABASE_ENV | string;
  DATABASE_NAME: DATABASE_ENV | string;
  DATABASE_USER: DATABASE_ENV | string;
  DATABASE_PASSWORD: DATABASE_ENV | string;
  DATABASE_PORT: DATABASE_ENV | string | number;

  /** Cache */
  REDIS_HOST: REDIS_ENV | string;
  REDIS_PORT: REDIS_ENV | string | number;

  /** MQTT Broker */
  MQTT_BROKER_URL: MQTT_ENV | string;

  JWT_ACCESS_SECRET: JWT_ENV | string;
  JWT_REFRESH_SECRET: JWT_ENV | string;
  JWT_ACCESS_EXPIRES_IN: JWT_ENV | string;
  JWT_REFRESH_EXPIRES_IN: JWT_ENV | string;
}
