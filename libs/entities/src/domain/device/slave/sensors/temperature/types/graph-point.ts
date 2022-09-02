export class GraphPoint {
  public readonly x: string;
  public readonly y: number;
  public readonly etc: string;

  constructor(x: string, y: number, min: number, max: number) {
    this.x = x;
    this.y = y;
    this.etc = this.contains(y, min, max) ? 'stable' : 'unstable';
  }

  private contains(average: number, min: number, max: number) {
    return average >= min && average <= max;
  }
}
