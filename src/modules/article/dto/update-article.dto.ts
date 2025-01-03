import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';

const updateArticleSchema = z.object({
  description: z.string().optional(),
  title: z.string().optional(),
  userId: z.number().optional(),
});

export class UpdateArticleDto extends createZodDto(updateArticleSchema) {}
