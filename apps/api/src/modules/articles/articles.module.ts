import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ArticlesController } from '../../api/articles.controller';
import { ArticlesService } from './articles.service';
import { ArticlesEntity } from './entities/articles.entity';
import { ArticlesRepository } from './repositories/articles.repository';

@Module({
  controllers: [ArticlesController],
  imports: [TypeOrmModule.forFeature([ArticlesEntity])],
  providers: [ArticlesService, ArticlesRepository],
})
export class ArticlesModule {}
