import { Module } from '@nestjs/common';

import { ArticleController } from '../../api/article/article.controller';
import { PrismaModule } from '../../common/database/prisma.module';
import { ArticleRepositoryService } from './article.repository';
import { ArticleService } from './article.service';

@Module({
  controllers: [ArticleController],
  imports: [PrismaModule],
  providers: [ArticleService, ArticleRepositoryService],
})
export class ArticleModule {}
