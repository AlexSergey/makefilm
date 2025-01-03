import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { ArticleRepositoryService } from './article.repository';
import { CreateArticleDto, UpdateArticleDto } from './dto';
import { ArticleEntityInterface } from './types/article-entity.interface';
import { Article } from './values/article.value';

@Injectable()
export class ArticleService {
  constructor(private articleRepository: ArticleRepositoryService) {}

  convertEntityToValue(articleEntity: ArticleEntityInterface): Article {
    return new Article({
      description: articleEntity.description,
      id: articleEntity.id,
      title: articleEntity.title,
      userId: articleEntity.userId,
    });
  }

  async create(data: CreateArticleDto): Promise<Article> {
    const articleEntity = await this.articleRepository.create(data);

    return this.convertEntityToValue(articleEntity);
  }

  async findAll(params: {
    cursor?: Prisma.ArticleWhereUniqueInput;
    orderBy?: Prisma.ArticleOrderByWithRelationInput;
    skip?: number;
    take?: number;
    where?: Prisma.ArticleWhereInput;
  }): Promise<Article[]> {
    const articleEntities = await this.articleRepository.findAll(params);

    if (!articleEntities) {
      return [];
    }

    return articleEntities.map((articleEntity) => this.convertEntityToValue(articleEntity));
  }

  async findOne(id: number): Promise<Article> {
    const articleEntity = await this.articleRepository.findOne(id);

    if (!articleEntity) {
      throw new NotFoundException('Article does not exist');
    }

    return this.convertEntityToValue(articleEntity);
  }

  async remove(id: number): Promise<void> {
    const articleEntity = await this.articleRepository.findOne(id);

    if (!articleEntity) {
      throw new NotFoundException('Article does not exist');
    }

    await this.articleRepository.remove(id);
  }

  async update(id: number, data: UpdateArticleDto): Promise<Article> {
    const articleEntity = await this.articleRepository.update(id, data);

    if (!articleEntity) {
      throw new NotFoundException('Article does not exist');
    }

    return this.convertEntityToValue(articleEntity);
  }
}
