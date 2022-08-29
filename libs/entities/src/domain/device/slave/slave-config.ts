export interface SlaveConfigsResponse {
  rangeBegin: number;
  rangeEnd: number;
  updateCycle: number;
  waterPumpCycle: number;
  waterPumpRuntime: number;
  ledCycle: number;
  ledRuntime: number;
}

export const defaultSlaveConfig: SlaveConfigsResponse = {
  rangeBegin: 15,
  rangeEnd: 30,
  updateCycle: 30,
  waterPumpCycle: 3,
  waterPumpRuntime: 10,
  ledCycle: 3,
  ledRuntime: 10,
};

export interface DefaultSensorConfig {
  rangeBegin: number;
  rangeEnd: number;
  updateCycle: number;
  runtime: number;
  cycle: number;
}

export const defaultThermometerConfig: Partial<DefaultSensorConfig> = {
  rangeBegin: 15,
  rangeEnd: 30,
  updateCycle: 30,
};

export const defaultLedConfig: Partial<DefaultSensorConfig> = {
  cycle: 3,
  runtime: 10,
};

export const defaultWaterPumpConfig: Partial<DefaultSensorConfig> = {
  cycle: 3,
  runtime: 10,
};

export type LedConfig = Pick<DefaultSensorConfig, 'runtime' | 'cycle'>;
export type WaterPumpConfig = Pick<DefaultSensorConfig, 'runtime' | 'cycle'>;

export type ILedConfig = Pick<SlaveConfigsResponse, 'ledCycle' | 'ledRuntime'>;

export type IWaterPumpConfig = Pick<
  SlaveConfigsResponse,
  'waterPumpCycle' | 'waterPumpRuntime'
>;

export type ITemperatureConfig = Pick<
  SlaveConfigsResponse,
  'rangeBegin' | 'rangeEnd' | 'updateCycle'
>;
