import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ArticleController } from '../../api/article.controller';
import { ArticleService } from './article.service';
import { Article } from './entities/article';
import { ArticleRepository } from './repositories/article.repository';

@Module({
  controllers: [ArticleController],
  imports: [TypeOrmModule.forFeature([Article])],
  providers: [ArticleService, ArticleRepository],
})
export class ArticleModule {}
