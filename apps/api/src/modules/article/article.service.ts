import { CreateArticleDto, UpdateArticleDto } from '@makefilm/contracts';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Filter } from '../../common/database/decorators/filter.decorator';
import { Pagination } from '../../common/database/decorators/pagination.decorator';
import { Sorting } from '../../common/database/decorators/sort.decorator';
import { dataQuery } from '../../common/database/utils/data-query.util';
import { ArticleEntity } from './entities/article.entity';
import { Article } from './values/article.value';

@Injectable()
export class ArticleService {
  constructor(@InjectRepository(ArticleEntity) private articleRepository: Repository<ArticleEntity>) {}

  convertEntityToValue(articleEntity: ArticleEntity): Article {
    return new Article({
      description: articleEntity.description,
      id: articleEntity.id,
      title: articleEntity.title,
    });
  }

  async create(data: CreateArticleDto): Promise<Article> {
    const article = this.articleRepository.create(data);
    const articleEntity = await this.articleRepository.save(article);

    return this.convertEntityToValue(articleEntity);
  }

  async findAll(params: { filter?: Filter; pagination?: Pagination; search?: string; sort?: Sorting }): Promise<{
    articles: Article[];
    total: number;
  }> {
    try {
      const q = dataQuery(['title'], params);

      const [articles, total] = await this.articleRepository.findAndCount(q);

      return {
        articles: articles.map((article) => new Article(article)),
        total,
      };
    } catch {
      throw new NotFoundException('Articles not found');
    }
  }

  async findOne(id: string): Promise<Article> {
    try {
      const articleEntity = await this.articleRepository.findOne({
        where: { id },
      });

      return this.convertEntityToValue(articleEntity);
    } catch {
      throw new NotFoundException('Article not found');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.articleRepository.delete({ id });
    } catch {
      throw new NotFoundException('Article not found');
    }
  }

  async update(id: string, data: UpdateArticleDto): Promise<Article> {
    try {
      const articleEntity = await this.articleRepository.findOne({
        where: { id },
      });
      const articleUpdatedEntity = await this.articleRepository.save({
        ...{ description: articleEntity.description, id: articleEntity.id, title: articleEntity.title },
        ...data,
      });

      return this.convertEntityToValue(articleUpdatedEntity);
    } catch {
      throw new NotFoundException('Article not found');
    }
  }
}
