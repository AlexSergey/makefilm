import { Module } from '@nestjs/common';

import { ArticleController } from '../../api/article/article.controller';
import { PrismaService } from '../../common/database/prisma.service';
import { ArticleRepositoryService } from './article.repository';
import { ArticleService } from './article.service';

@Module({
  controllers: [ArticleController],
  imports: [],
  providers: [ArticleService, ArticleRepositoryService, PrismaService],
})
export class ArticleModule {}
