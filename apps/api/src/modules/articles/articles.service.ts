import { CreateArticleDto, UpdateArticleDto } from '@makefilm/contracts';
import { ArticlesEntity } from '@makefilm/entities';
import { Injectable, NotFoundException } from '@nestjs/common';

import { Filter } from '../../common/database/decorators/filter.decorator';
import { Pagination } from '../../common/database/decorators/pagination.decorator';
import { Sorting } from '../../common/database/decorators/sort.decorator';
import { ArticlesRepository } from './repositories/articles.repository';
import { ArticleValue } from './values/article.value';

@Injectable()
export class ArticlesService {
  constructor(private readonly articleRepository: ArticlesRepository) {}

  convertEntityToValue(articleEntity: ArticlesEntity): ArticleValue {
    return new ArticleValue({
      description: articleEntity.description,
      id: articleEntity.id,
      title: articleEntity.title,
    });
  }

  async create(data: CreateArticleDto): Promise<ArticleValue> {
    const article = await this.articleRepository.createArticle(data);

    return this.convertEntityToValue(article);
  }

  async findAll(params: { filter?: Filter; pagination?: Pagination; search?: string; sort?: Sorting }): Promise<{
    articles: ArticleValue[];
    total: number;
  }> {
    try {
      const [articles, total] = await this.articleRepository.findAllArticles(params);

      return {
        articles: articles.map((article) => new ArticleValue(article)),
        total,
      };
    } catch {
      throw new NotFoundException('Articles not found');
    }
  }

  async findOne(id: string): Promise<ArticleValue> {
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
      await this.articleRepository.deleteArticle(id);
    } catch {
      throw new NotFoundException('Article not found');
    }
  }

  async update(id: string, data: UpdateArticleDto): Promise<ArticleValue> {
    try {
      const article = await this.articleRepository.updateArticle(id, data);

      return this.convertEntityToValue(article);
    } catch {
      throw new NotFoundException('Article not found');
    }
  }
}
