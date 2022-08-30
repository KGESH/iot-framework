import { DeleteResult, UpdateResult } from 'typeorm';

export const notAffected = (queryResult: UpdateResult | DeleteResult) => {
  return queryResult.affected === 0;
};
