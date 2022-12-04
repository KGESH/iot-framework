/** Add your development environment variables here
 *
 *  if you create new app
 *  replace /apps/your app name/project.json -> "fileReplacements" path
 *  you can customize your own env path
 *
 *  @Before
 *  "fileReplacements": [
 *                 {
 *                   "replace": "apps/your app name/src/environments/environment.ts",
 *                   "with": "apps/your app name/src/environments/environment.prod.ts"
 *                 }
 *               ]
 *
 *
 *  @After
 * "fileReplacements": [
 *             {
 *               "replace": "libs/core/src/secrets/environments/environment.ts",
 *               "with": "libs/core/src/secrets/environments/environment.prod.ts"
 *             }
 *           ]
 * */

export const environment = {
  production: false,

  API_GATEWAY_HOST: '0.0.0.0',
  API_GATEWAY_PORT: 7777,
  API_GATEWAY_URL_PREFIX: 'api',
  API_GATEWAY_URL: 'http://0.0.0.0:7777/api/',

  DEVICE_MS_HOST: '0.0.0.0',
  DEVICE_MS_PORT: 8000,
  DEVICE_MS_URL_PREFIX: 'device',
  DEVICE_MS_URL: 'http://0.0.0.0:8000/device/',

  USER_MS_HOST: '0.0.0.0',
  USER_MS_PORT: 9000,
  USER_MS_URL_PREFIX: 'user',
  USER_MS_URL: 'http://0.0.0.0:9000/user/',

  DATABASE_TYPE: 'postgres',
  DATABASE_HOST: '0.0.0.0',
  DATABASE_NAME: 'test',
  DATABASE_USER: 'postgres',
  DATABASE_PASSWORD: '789456',
  DATABASE_PORT: 5433,

  REDIS_HOST: '0.0.0.0',
  REDIS_PORT: 6379,

  MQTT_BROKER_URL: 'mqtt://43.200.81.115:1883',

  JWT_ACCESS_SECRET: 'my_dev_secret',
  JWT_REFRESH_SECRET: 'my_dev_refresh_secret',
  JWT_ACCESS_EXPIRES_IN: '300m',
  JWT_REFRESH_EXPIRES_IN: '14d',

  COOKIE_DOMAIN: 'http://localhost:3000',
};
