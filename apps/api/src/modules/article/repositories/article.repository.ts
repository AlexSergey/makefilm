import { CreateArticleDto, UpdateArticleDto } from '@makefilm/contracts';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Filter } from '../../../common/database/decorators/filter.decorator';
import { Pagination } from '../../../common/database/decorators/pagination.decorator';
import { Sorting } from '../../../common/database/decorators/sort.decorator';
import { dataQuery } from '../../../common/database/utils/data-query.util';
import { Article } from '../entities/article';

@Injectable()
export class ArticleRepository extends Repository<Article> {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
  ) {
    super(articleRepository.target, articleRepository.manager, articleRepository.queryRunner);
  }

  async createArticle(data: CreateArticleDto): Promise<Article> {
    const article = this.articleRepository.create(data);

    return await this.articleRepository.save(article);
  }

  async deleteArticle(id: string): Promise<void> {
    await this.articleRepository.delete({ id });
  }

  async findAllArticles(params: {
    filter?: Filter;
    pagination?: Pagination;
    search?: string;
    sort?: Sorting;
  }): Promise<[Article[], number]> {
    const q = dataQuery(['title'], params);

    return await this.articleRepository.findAndCount(q);
  }

  async updateArticle(id: string, data: UpdateArticleDto): Promise<Article> {
    const articleEntity = await this.articleRepository.findOne({
      where: { id },
    });

    return await this.articleRepository.save({
      ...{ description: articleEntity.description, id: articleEntity.id, title: articleEntity.title },
      ...data,
    });
  }
}
