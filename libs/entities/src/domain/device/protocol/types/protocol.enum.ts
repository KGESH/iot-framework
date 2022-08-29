export const START = 0x23;

export enum TargetMemoryAddress {
  ALL = 0xff,
  MASTER = 0x00,
}

export enum Command {
  POLLING = 0xa0,
  READ = 0xc1,
  WRITE = 0xd1,
  EMERGENCY = 0xe0,
}

export enum IndexPriority {
  EMERGENCY = 0x21,
  HIGH = 0x22,
  COMMON = 0x23,
  LOW = 0x27,
}

export enum MEMORY_ADDRESS_HIGH {
  TEMPERATURE = 0x20,
  MOTOR = 0x0f,
  LED = 0x0f,
  FAN = 0x10,
}

export enum MEMORY_ADDRESS_LOW {
  TEMPERATURE = 0x0c,
  MOTOR = 0xa1,
  LED = 0xdd,
  FAN = 0x19,
}
