import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from '../../common/database/prisma.service';
import { ArticleRepositoryService } from './article.repository';
import { ArticleService } from './article.service';
import { CreateArticleDto, UpdateArticleDto } from './dto';

describe('ArticleService', () => {
  let service: ArticleService;
  let articleRepository: ArticleRepositoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArticleService,
        {
          provide: PrismaService,
          useValue: {
            // Mock implementation of PrismaService methods if needed
          },
        },
        {
          provide: ArticleRepositoryService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            remove: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ArticleService>(ArticleService);
    articleRepository = module.get<ArticleRepositoryService>(ArticleRepositoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an article', async () => {
      const createArticleDto: CreateArticleDto = { description: 'Test Description', title: 'Test Title', userId: 1 };
      const result = {
        createdAt: new Date(),
        description: 'Test Description',
        id: 1,
        title: 'Test Title',
        updatedAt: new Date(),
        userId: 1,
      };

      jest.spyOn(articleRepository, 'create').mockResolvedValue(result);

      expect(await service.create(createArticleDto)).toEqual({
        description: result.description,
        id: result.id,
        title: result.title,
        userId: result.userId,
      });
      expect(articleRepository.create).toHaveBeenCalledWith(createArticleDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of articles', async () => {
      const result = [
        {
          createdAt: new Date(),
          description: 'Test Description',
          id: 1,
          title: 'Test Title',
          updatedAt: new Date(),
          userId: 1,
        },
      ];
      const params = { skip: 0, take: 10 };

      jest.spyOn(articleRepository, 'findAll').mockResolvedValue(result);

      expect(await service.findAll(params)).toEqual([
        {
          description: result[0].description,
          id: result[0].id,
          title: result[0].title,
          userId: result[0].userId,
        },
      ]);
      expect(articleRepository.findAll).toHaveBeenCalledWith(params);
    });
  });

  describe('findOne', () => {
    it('should return a single article', async () => {
      const result = {
        createdAt: new Date(),
        description: 'Test Description',
        id: 1,
        title: 'Test Title',
        updatedAt: new Date(),
        userId: 1,
      };

      jest.spyOn(articleRepository, 'findOne').mockResolvedValue(result);

      expect(await service.findOne(1)).toEqual({
        description: result.description,
        id: result.id,
        title: result.title,
        userId: result.userId,
      });
      expect(articleRepository.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('remove', () => {
    it('should remove an article', async () => {
      const result = {
        createdAt: new Date(),
        description: 'Test Description',
        id: 1,
        title: 'Test Title',
        updatedAt: new Date(),
        userId: 1,
      };

      jest.spyOn(articleRepository, 'findOne').mockResolvedValue(result);

      expect(await service.remove(1)).toBeUndefined();
      expect(articleRepository.remove).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update an article', async () => {
      jest.spyOn(articleRepository, 'findOne').mockResolvedValue({
        createdAt: new Date(),
        description: 'Test Description',
        id: 1,
        title: 'Test Title',
        updatedAt: new Date(),
        userId: 1,
      });

      const updateArticleDto: UpdateArticleDto = {
        description: 'Updated Description',
        title: 'Updated Title',
        userId: 1,
      };
      const result = {
        createdAt: new Date(),
        description: 'Updated Description',
        id: 1,
        title: 'Updated Title',
        updatedAt: new Date(),
        userId: 1,
      };

      jest.spyOn(articleRepository, 'update').mockResolvedValue(result);

      expect(await service.update(1, updateArticleDto)).toEqual({
        description: result.description,
        id: 1,
        title: result.title,
        userId: result.userId,
      });
      expect(articleRepository.update).toHaveBeenCalledWith(1, updateArticleDto);
    });
  });
});
