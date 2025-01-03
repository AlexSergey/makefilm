import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../common/database/prisma.service';
import { CreateArticleDto, UpdateArticleDto } from './dto';
import { ArticleEntityInterface } from './types/article-entity.interface';

@Injectable()
export class ArticleRepositoryService {
  constructor(private prisma: PrismaService) {}

  async create({ description, title, userId }: CreateArticleDto) {
    return this.prisma.article.create({
      data: {
        description,
        title,
        userId,
      },
    });
  }

  async findAll(params: {
    cursor?: Prisma.ArticleWhereUniqueInput;
    orderBy?: Prisma.ArticleOrderByWithRelationInput;
    skip?: number;
    take?: number;
    where?: Prisma.ArticleWhereInput;
  }): Promise<ArticleEntityInterface[]> {
    const { cursor, orderBy, skip, take, where } = params;

    return this.prisma.article.findMany({
      cursor,
      orderBy,
      skip,
      take,
      where,
    });
  }

  async findOne(id: number): Promise<ArticleEntityInterface | null> {
    return this.prisma.article.findUnique({ where: { id } });
  }

  async remove(id: number): Promise<ArticleEntityInterface | null> {
    return this.prisma.article.delete({ where: { id } });
  }

  async update(id: number, data: UpdateArticleDto): Promise<ArticleEntityInterface | null> {
    return this.prisma.article.update({ data, where: { id } });
  }
}
