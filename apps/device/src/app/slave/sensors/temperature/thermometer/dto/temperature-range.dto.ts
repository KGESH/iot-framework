export class TemperatureRangeDto {
  constructor(readonly temperature: number, readonly min: number, readonly max: number) {}

  isUnStableTemperature(): boolean {
    return !this.contains();
  }

  private contains(): boolean {
    return this.temperature >= this.min && this.temperature <= this.max;
  }
}
