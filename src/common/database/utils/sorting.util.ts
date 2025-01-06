import { Sorting } from '../decorators/sort.decorator';

export const getOrder = (sort: Sorting): false | Record<string, string> =>
  sort ? { [sort.property]: sort.direction } : false;
