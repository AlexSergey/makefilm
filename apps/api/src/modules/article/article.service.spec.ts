import { createMock } from '@golevelup/ts-jest';
import { CreateArticleDto, UpdateArticleDto } from '@makefilm/contracts';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ArticleService } from './article.service';
import { ArticleEntity } from './entities/article.entity';

describe('ArticleService', () => {
  let service: ArticleService;
  const token = getRepositoryToken(ArticleEntity);
  let articleRepository: Repository<ArticleEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArticleService,
        {
          provide: token,
          useValue: createMock<Repository<ArticleEntity>>(),
        },
      ],
    }).compile();

    service = module.get<ArticleService>(ArticleService);
    articleRepository = await module.resolve<Repository<ArticleEntity>>(token);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an article', async () => {
      const createArticleDto: CreateArticleDto = { description: 'Test Description', title: 'Test Title' };
      const result = {
        createdAt: new Date(),
        description: 'Test Description',
        id: '1',
        title: 'Test Title',
        updatedAt: new Date(),
      };
      (articleRepository.create as jest.Mock).mockResolvedValue(result);
      (articleRepository.save as jest.Mock).mockResolvedValue(result);

      expect(await service.create(createArticleDto)).toEqual({
        description: result.description,
        id: result.id,
        title: result.title,
      });
    });
  });

  describe('findAll', () => {
    it('should return an array of articles', async () => {
      const result = [
        {
          createdAt: new Date(),
          description: 'Test Description',
          id: '1',
          title: 'Test Title',
          updatedAt: new Date(),
        },
      ];

      (articleRepository.findAndCount as jest.Mock).mockResolvedValue([result, result.length]);

      expect(await service.findAll({})).toEqual({
        articles: [
          {
            description: result[0].description,
            id: result[0].id,
            title: result[0].title,
          },
        ],
        total: 1,
      });
    });
  });

  describe('findOne', () => {
    it('should return a single article', async () => {
      const result = {
        createdAt: new Date(),
        description: 'Test Description',
        id: '1',
        title: 'Test Title',
        updatedAt: new Date(),
      };

      (articleRepository.findOne as jest.Mock).mockResolvedValue(result);

      expect(await service.findOne('1')).toEqual({
        description: result.description,
        id: result.id,
        title: result.title,
      });
    });
  });

  describe('remove', () => {
    it('should remove an article', async () => {
      const result = {
        createdAt: new Date(),
        description: 'Test Description',
        id: '1',
        title: 'Test Title',
        updatedAt: new Date(),
      };

      (articleRepository.findOne as jest.Mock).mockResolvedValue(result);

      expect(await service.remove('1')).toBeUndefined();
    });
  });

  describe('update', () => {
    it('should update an article', async () => {
      jest.spyOn(articleRepository, 'findOne').mockResolvedValue({
        createdAt: new Date(),
        description: 'Test Description',
        id: '1',
        title: 'Test Title',
        updatedAt: new Date(),
      });

      const updateArticleDto: UpdateArticleDto = {
        description: 'Updated Description',
        title: 'Updated Title',
      };
      const result = {
        createdAt: new Date(),
        description: 'Updated Description',
        id: '1',
        title: 'Updated Title',
        updatedAt: new Date(),
      };

      (articleRepository.save as jest.Mock).mockResolvedValue(result);

      expect(await service.update('1', updateArticleDto)).toEqual({
        description: 'Updated Description',
        id: '1',
        title: 'Updated Title',
      });
    });
  });
});
