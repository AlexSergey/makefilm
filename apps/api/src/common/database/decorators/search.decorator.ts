import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

// ?filter={"q":"test"}
export const SearchParams = createParamDecorator((validParams, ctx: ExecutionContext) => {
  const req: Request = ctx.switchToHttp().getRequest();

  if (typeof req.query.filter === 'string') {
    try {
      const filter = JSON.parse(req.query.filter);

      return filter.q;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);

      return null;
    }
  }
});
