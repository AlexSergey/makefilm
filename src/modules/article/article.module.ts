import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ArticleController } from '../../api/article/article.controller';
import { ArticleService } from './article.service';
import { ArticleEntity } from './entities/article.entity';

@Module({
  controllers: [ArticleController],
  imports: [TypeOrmModule.forFeature([ArticleEntity])],
  providers: [ArticleService],
})
export class ArticleModule {}
