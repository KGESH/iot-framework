import { GraphPoint } from '@iot-framework/entities';

export class GraphSource {
  constructor(private readonly graphPoints: GraphPoint[]) {}

  sort(): GraphPoint[] {
    return this.graphPoints.sort((a, b): number => (a.x < b.x ? -1 : 1));
  }
}
