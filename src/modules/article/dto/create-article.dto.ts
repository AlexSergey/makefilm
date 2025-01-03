import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';

const createArticleSchema = z.object({
  description: z.string(),
  title: z.string(),
  userId: z.number(),
});

export class CreateArticleDto extends createZodDto(createArticleSchema) {}
