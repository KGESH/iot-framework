export interface AverageFilterSource {
  temperatureAverage: number;
  temperatureCount: number;
}

export class DayAverage {
  private constructor(
    public readonly temperatureAverage: number,
    public readonly temperatureCount: number
  ) {}

  static createNewAverageFilter(temperature: number) {
    return new DayAverage(temperature, 1);
  }

  static createAverageFilter(source: AverageFilterSource) {
    return new DayAverage(source.temperatureAverage, source.temperatureCount);
  }

  getAverageFilterSource(): AverageFilterSource {
    return { temperatureAverage: this.temperatureAverage, temperatureCount: this.temperatureCount };
  }

  getUpdateAverageFilterSource(newTemperature: number): AverageFilterSource {
    const updatedAverage = this.makeUpdateAverage(newTemperature);
    const updatedCount = this.temperatureCount + 1;

    return { temperatureAverage: updatedAverage, temperatureCount: updatedCount };
  }

  /** Get updated temperature average
   * See 'average filter' algorithm */
  private makeUpdateAverage(newTemperature: number): number {
    return (
      this.temperatureAverage * (this.temperatureCount / (this.temperatureCount + 1)) +
      newTemperature / (this.temperatureCount + 1)
    );
  }
}
