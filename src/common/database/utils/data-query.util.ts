import { Raw } from 'typeorm';

import { Filter } from '../decorators/filter.decorator';
import { Pagination } from '../decorators/pagination.decorator';
import { Sorting } from '../decorators/sort.decorator';
import { getOrder } from './sorting.util';

interface Query {
  order: Record<string, string> | undefined;
  skip: number | undefined;
  take: number | undefined;
  where: Record<string, string> | undefined;
}

export const dataQuery = (
  searchFields: string[],
  {
    filter,
    pagination,
    search,
    sort,
  }: {
    filter?: Filter;
    pagination?: Pagination;
    search?: string;
    sort?: Sorting;
  },
): Query => {
  const order = getOrder(sort);
  let where =
    typeof search === 'string'
      ? searchFields.reduce((where, searchField) => {
          return {
            ...where,
            ...{
              [searchField]: Raw((alias) => `LOWER(${alias}) LIKE LOWER(:search)`, { search: `%${search}%` }),
            },
          };
        }, {})
      : false;

  const q = {
    order: undefined,
    skip: undefined,
    take: undefined,
    where: undefined,
  };

  if (typeof filter === 'object' && Object.keys(filter).length > 0) {
    if (!where) {
      where = {};
    }
    Object.keys(filter).forEach((key) => {
      where[key] = filter[key];
    });
  }

  if (typeof pagination?.skip === 'number') {
    q.skip = pagination?.skip;
  }

  if (typeof pagination?.take === 'number') {
    q.take = pagination?.take;
  }

  if (order) {
    q.order = order;
  }

  if (where) {
    q.where = where;
  }

  return q;
};
