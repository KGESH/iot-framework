/** Todo: Refactoring topics */
export enum ESlaveConfigTopic {
  ALL = 'config',
  THERMOMETER = 'config/temperature',
  WATER_PUMP = 'config/water',
  LED = 'config/led',
}

export enum ESlaveTurnPowerTopic {
  WATER_PUMP = 'power/water',
  LED = 'power/led',
  FAN = 'power/fan',
}

export enum EPowerState {
  ON = 'on',
  OFF = 'off',
}

export enum ESensor {
  LED = 'led',
  WATER_PUMP = 'water',
  FAN = 'fan',
  THERMOMETER = 'thermometer',
}

export enum ESlaveStateTopic {
  ALL = 'state',
  THERMOMETER = 'temperature/state',
  WATER_PUMP = 'water/state',
  LED = 'led/state',
  FAN = 'fan/state',
}

export const POLLING = 'master/+/polling';

export const TEMPERATURE_WEEK = 'temperature/week';
