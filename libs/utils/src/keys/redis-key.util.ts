import { format } from 'date-fns';
import { ESlaveConfigTopic, ESlaveStateTopic, ESlaveTurnPowerTopic } from '@iot-framework/utils';
import { Sensor } from '@iot-framework/entities';

interface IRunningKey {
  sensor: Sensor;
  masterId: number;
  slaveId: number;
}

interface IPowerKey {
  sensor: Sensor;
  masterId: number;
  slaveId: number;
}

interface IConfigKey {
  sensor: ESlaveConfigTopic;
  masterId: number;
  slaveId: number;
}

export const SensorRunningStateKey = ({ sensor, masterId, slaveId }: IRunningKey) =>
  `state/${sensor}/${masterId}/${slaveId}`;

export const SensorPowerKey = ({ sensor, masterId, slaveId }: IPowerKey) =>
  `power/${sensor}/${masterId}/${slaveId}`;

export const SensorConfigKey = ({ sensor, masterId, slaveId }: IConfigKey) =>
  `config/${sensor}/${masterId}/${slaveId}`;

/** Todo: Make Policy After ... */
export const MasterPollingKey = (key: string) => key;

/** key 문자열에서 week가 맞는지 검토 필요 week 인지 day 인지 */
export const GenerateDayAverageKey = (masterId: number, slaveId: number, date: Date) =>
  `temperature/week/${masterId}/${slaveId}/${format(date, `yyyy/MM/dd`)}`;

export const GenerateAverageKeys = (
  masterId: number,
  slaveId: number,
  beginDate: Date,
  endDate: Date,
  addFunction: (date: Date | number, amount: number) => Date,
  timeAmount: number
) => {
  const generateKey = (masterId: number, slaveId: number, date: string) =>
    `temperature/week/${masterId}/${slaveId}/${date}`;
  const keys: string[] = [];

  for (let date = beginDate; date < endDate; date = addFunction(date, timeAmount)) {
    keys.push(generateKey(masterId, slaveId, format(date, `yyyy/MM/dd`)));
  }

  return keys;
};

export const GenerateRefreshTokenKey = (userId: number) => `refresh-token/${userId}`;
