export class MockUtil {
  static setMock(mock: unknown): any {
    return mock as any;
  }
}

export class MockMqttBroker {
  emit(topic: string, payload: unknown): unknown {
    return { pattern: topic, data: payload };
  }

  send(topic: string, payload: unknown): unknown {
    return { pattern: topic, data: payload };
  }
}
