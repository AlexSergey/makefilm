import { ClassSerializerInterceptor, INestApplication } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import { ArticleController } from '../src/api/article/article.controller';
import { PrismaService } from '../src/common/database/prisma.service';
import { HttpExceptionFilter } from '../src/filters/http-exception.filter';
import { TransformInterceptor } from '../src/interceptors/transform.interceptor';
import { ArticleRepositoryService } from '../src/modules/article/article.repository';
import { ArticleService } from '../src/modules/article/article.service';
import { CreateArticleDto, UpdateArticleDto } from '../src/modules/article/dto';
import { ResolvePromisesInterceptor } from '../src/utils/serializer.interceptor';

// TODO: Temporary mock Prisma
jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => {
      return {};
    }),
  };
});
describe('ArticleController (e2e)', () => {
  let app: INestApplication;

  // Создание мок-сервиса для тестов
  const mockArticleRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
    update: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArticleController],
      providers: [
        ArticleService,
        PrismaService,
        { provide: ArticleRepositoryService, useValue: mockArticleRepository },
      ],
    }).compile();

    app = module.createNestApplication();
    const reflector = app.get(Reflector);

    // Global exception filter
    app.useGlobalFilters(new HttpExceptionFilter());
    // Global pipes
    // Global interceptor
    app.useGlobalInterceptors(
      new ResolvePromisesInterceptor(),
      // ResolvePromisesInterceptor is used to resolve promises in responses because class-transformer can't do it
      // https://github.com/typestack/class-transformer/issues/549
      new ClassSerializerInterceptor(reflector),
      new TransformInterceptor(),
    );
    await app.init();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /articles', () => {
    it('should create a new article', async () => {
      const createArticleDto: CreateArticleDto = {
        description: 'This is a new article content.',
        title: 'New Article',
        userId: 1,
      };
      mockArticleRepository.create.mockResolvedValue(createArticleDto);

      const response = await request(app.getHttpServer()).post('/articles').send(createArticleDto).expect(201);

      expect(response.body.data).toEqual(createArticleDto);
      expect(mockArticleRepository.create).toHaveBeenCalledWith(createArticleDto);
    });
  });

  describe('GET /articles', () => {
    it('should return a list of articles', async () => {
      const articles = [
        { description: 'Content 1', id: 1, title: 'Article 1' },
        { description: 'Content 2', id: 2, title: 'Article 2' },
      ];
      mockArticleRepository.findAll.mockResolvedValue(articles);

      const response = await request(app.getHttpServer()).get('/articles').expect(200);

      expect(response.body.data).toEqual(articles);
      expect(mockArticleRepository.findAll).toHaveBeenCalled();
    });

    it('should handle pagination and filtering', async () => {
      const articles = [{ description: 'Content 1', id: 1, title: 'Article 1', userId: 1 }];
      mockArticleRepository.findAll.mockResolvedValue(articles);

      const response = await request(app.getHttpServer())
        .get('/articles')
        .query({ skip: 0, take: 10, where: { title: 'Article 1' } })
        .expect(200);

      expect(response.body.data).toEqual(articles);
      expect(mockArticleRepository.findAll).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        where: { title: 'Article 1' },
      });
    });
  });

  describe('GET /articles/:id', () => {
    it('should return a single article by ID', async () => {
      const article = { description: 'Content 1', id: 1, title: 'Article 1' };
      mockArticleRepository.findOne.mockResolvedValue(article);

      const response = await request(app.getHttpServer()).get('/articles/1').expect(200);

      expect(response.body.data).toEqual(article);
      expect(mockArticleRepository.findOne).toHaveBeenCalledWith(1);
    });

    it('should return 404 if article not found', async () => {
      mockArticleRepository.findOne.mockResolvedValue(null);

      await request(app.getHttpServer()).get('/articles/999').expect(404);

      expect(mockArticleRepository.findOne).toHaveBeenCalledWith(999);
    });
  });

  describe('DELETE /articles/:id', () => {
    it('should delete an article by ID', async () => {
      const article = { description: 'Content 1', id: 1, title: 'Article 1' };
      mockArticleRepository.findOne.mockResolvedValue(article);

      const response = await request(app.getHttpServer()).delete('/articles/1').expect(200);

      expect(response.body).toEqual(
        expect.objectContaining({
          message: 'Request successful',
          success: true,
        }),
      );
      expect(mockArticleRepository.remove).toHaveBeenCalledWith(1);
    });

    it('should return 404 if article not found for deletion', async () => {
      mockArticleRepository.remove.mockResolvedValue({ affected: 0 });

      await request(app.getHttpServer()).delete('/articles/999').expect(404);
    });
  });

  describe('PATCH /articles/:id', () => {
    it('should update an article by ID', async () => {
      const updateArticleDto: UpdateArticleDto = { title: 'Updated Title' };
      const updatedArticle = { description: 'Content 1', id: 1, title: 'Updated Title' };

      mockArticleRepository.update.mockResolvedValue(updatedArticle);

      const response = await request(app.getHttpServer()).patch('/articles/1').send(updateArticleDto).expect(200);

      expect(response.body.data).toEqual(updatedArticle);
      expect(mockArticleRepository.update).toHaveBeenCalledWith(1, updateArticleDto);
    });

    it('should return 404 if article not found for update', async () => {
      mockArticleRepository.update.mockResolvedValue(null);

      const updateArticleDto: UpdateArticleDto = { title: 'Updated Title' };

      await request(app.getHttpServer()).patch('/articles/999').send(updateArticleDto).expect(404);

      expect(mockArticleRepository.update).toHaveBeenCalledWith(999, updateArticleDto);
    });
  });
});
