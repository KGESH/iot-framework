export enum RedisTTL {
  SECOND = 1,
  MINUTE = 60,
  HOUR = MINUTE * MINUTE,
  DAY = HOUR * 24,
  WEEK = DAY * 7,
  MONTH = DAY * 30,
  INFINITY = 0,
}
