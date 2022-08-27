/** Add your production environment variables
 *
 *  at build time
 *  if build options --configuration=production
 *  auto replace file name environment.prod.ts -> environment.ts
 *  example) nx build --configuration=production
 *  */

export const environment = {
  production: true,

  API_GATEWAY_HOST: 'gateway',
  API_GATEWAY_PORT: 7777,
  API_GATEWAY_URL_PREFIX: 'api',

  DEVICE_MS_HOST: 'device',
  DEVICE_MS_PORT: 8000,
  DEVICE_MS_URL_PREFIX: 'device',

  USER_MS_HOST: 'user', // Todo: replace to aws container name
  USER_MS_PORT: 9000,
  USER_MS_URL_PREFIX: 'user',

  DATABASE_TYPE: 'postgres',
  DATABASE_HOST: 'db',
  DATABASE_NAME: 'test',
  DATABASE_USER: 'postgres',
  DATABASE_PASSWORD: 'test',
  DATABASE_PORT: 5432,

  REDIS_HOST: 'redis',
  REDIS_PORT: 6379,

  MQTT_BROKER_URL: 'mosquitto',

  JWT_ACCESS_SECRET: 'my_dev_secret',
  JWT_REFRESH_SECRET: 'my_dev_refresh_secret',
  JWT_ACCESS_EXPIRES_IN: '30m',
  JWT_REFRESH_EXPIRES_IN: '14d',
};
