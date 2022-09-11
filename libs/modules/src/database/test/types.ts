import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as path from 'path';

export const TestDatabaseConfigs: TypeOrmModuleOptions = {
  name: 'test',
  type: 'sqlite',
  database: ':memory:',
  logging: true,
  entities: [path.join(__dirname, '../../../../entities/src/domain/**/*.entity.{ts,js}')],
  // entities: [],
  synchronize: true,
  autoLoadEntities: true,
};
