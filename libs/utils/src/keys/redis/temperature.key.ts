import { addDays, format } from 'date-fns';

export class TemperatureKey {
  static getCurrentKey(masterId: number, slaveId: number) {
    return `temperature/${masterId}/${slaveId}`;
  }

  static getDayKey(masterId: number, slaveId: number, date: Date): string {
    return `temperature/average/${masterId}/${slaveId}/${this.formattedDate(date)}`;
  }

  static getDayKeys(masterId: number, slaveId: number, beginDate: Date, endDate: Date) {
    const keys: string[] = [];

    for (let date = beginDate; date < endDate; date = addDays(date, 1)) {
      keys.push(this.getDayKey(masterId, slaveId, date));
    }

    return keys;
  }

  static getDateFromKey(key: string): string {
    const [temperature, average, masterId, slaveId, year, month, day] = key.split('/');
    if (!year || !month || !day) {
      throw new Error('GetDateFromKey format error!');
    }

    return `${year}/${month}/${day}`;
  }

  private static formattedDate(date: Date) {
    return format(date, `yyyy/MM/dd`);
  }
}
