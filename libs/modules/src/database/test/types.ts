import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const TestDatabaseConfigs: TypeOrmModuleOptions = {
  name: 'test',
  type: 'sqlite',
  database: ':memory:',
  logging: true,
  entities: [],
  synchronize: true,
  autoLoadEntities: true,
};
