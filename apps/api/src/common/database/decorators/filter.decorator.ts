import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export type Filter = Record<string, string>;

// ?filter={"role":"moderator"}
export const FilterParams = createParamDecorator((validParams, ctx: ExecutionContext) => {
  const req: Request = ctx.switchToHttp().getRequest();

  if (typeof req.query.filter === 'string') {
    try {
      const filter: Filter = JSON.parse(req.query.filter);
      delete filter.q;

      return filter;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);

      return null;
    }
  }
});
