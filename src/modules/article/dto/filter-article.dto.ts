import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';

const filterArticleSchema = z.object({
  orderBy: z
    .object({
      createdAt: z.enum(['asc', 'desc']).optional(),
      title: z.enum(['asc', 'desc']).optional(),
    })
    .optional(),
  skip: z.preprocess((a) => parseInt(a as string, 10), z.number().min(0)).optional(),
  take: z.preprocess((a) => parseInt(a as string, 10), z.number().min(0)).optional(),
  where: z
    .object({
      title: z.string().optional(),
      userId: z.number().optional(),
    })
    .optional(),
});

export class FilterArticleDto extends createZodDto(filterArticleSchema) {}
