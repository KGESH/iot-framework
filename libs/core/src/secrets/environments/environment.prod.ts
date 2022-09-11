/** Add your production environment variables
 *
 *  at build time
 *  if build options --configuration=production
 *  auto replace file name environment.prod.ts -> environment.ts
 *  example) nx build --configuration=production
 *  */

export const environment = {
  production: true,

  API_GATEWAY_HOST: '0.0.0.0',
  API_GATEWAY_PORT: 7777,
  API_GATEWAY_URL_PREFIX: 'api',
  API_GATEWAY_URL: 'gateway/api/',

  DEVICE_MS_HOST: '0.0.0.0',
  DEVICE_MS_PORT: 8000,
  DEVICE_MS_URL_PREFIX: 'device',
  DEVICE_MS_URL: 'device/device/',

  USER_MS_HOST: '0.0.0.0', // Todo: replace to aws container name
  USER_MS_PORT: 9000,
  USER_MS_URL_PREFIX: 'user',
  USER_MS_URL: 'auth/user/',

  DATABASE_TYPE: 'postgres',
  DATABASE_HOST: 'iot-cluster-rds.cshttetfsiot.ap-northeast-2.rds.amazonaws.com',
  DATABASE_NAME: 'master',
  DATABASE_USER: 'postgres',
  DATABASE_PASSWORD: 'gksdldma123',
  DATABASE_PORT: 5432,

  REDIS_HOST: 'iot-cluster-cache.hrfbrq.ng.0001.apn2.cache.amazonaws.com',
  REDIS_PORT: 6379,

  MQTT_BROKER_URL: 'mqtt://43.200.81.115:1883',

  JWT_ACCESS_SECRET: 'my_dev_secret',
  JWT_REFRESH_SECRET: 'my_dev_refresh_secret',
  JWT_ACCESS_EXPIRES_IN: '30m',
  JWT_REFRESH_EXPIRES_IN: '14d',
};
