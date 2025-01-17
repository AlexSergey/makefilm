import { CreateArticleDto, UpdateArticleDto } from '@makefilm/contracts';
import { Test, TestingModule } from '@nestjs/testing';

import { ArticleService } from './article.service';
import { ArticleRepository } from './repositories/article.repository';

describe('ArticleService', () => {
  const mockArticle = {
    createdAt: new Date(),
    description: 'Test Description',
    id: '1',
    title: 'Test Title',
    updatedAt: new Date(),
  };
  let service: ArticleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ArticleRepository,
          useValue: {
            createArticle: jest.fn().mockResolvedValue(mockArticle),
            deleteArticle: jest.fn().mockResolvedValue(undefined),
            findAllArticles: jest.fn().mockResolvedValue([[mockArticle], 1]),
            findOne: jest.fn().mockResolvedValue(mockArticle),
            updateArticle: (id, data) => ({ ...mockArticle, ...data }),
          },
        },
        ArticleService,
      ],
    }).compile();

    service = module.get<ArticleService>(ArticleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an article', async () => {
      const createArticleDto: CreateArticleDto = { description: 'Test Description', title: 'Test Title' };

      expect(await service.create(createArticleDto)).toEqual({
        description: mockArticle.description,
        id: mockArticle.id,
        title: mockArticle.title,
      });
    });
  });

  describe('findAll', () => {
    it('should return an array of articles', async () => {
      expect(await service.findAll({})).toEqual({
        articles: [
          {
            description: mockArticle.description,
            id: mockArticle.id,
            title: mockArticle.title,
          },
        ],
        total: 1,
      });
    });
  });

  describe('findOne', () => {
    it('should return a single article', async () => {
      expect(await service.findOne('1')).toEqual({
        description: mockArticle.description,
        id: mockArticle.id,
        title: mockArticle.title,
      });
    });
  });

  describe('remove', () => {
    it('should remove an article', async () => {
      expect(await service.remove('1')).toBeUndefined();
    });
  });

  describe('update', () => {
    it('should update an article', async () => {
      const updateArticleDto: UpdateArticleDto = {
        description: 'Updated Description',
        title: 'Updated Title',
      };

      expect(await service.update('1', updateArticleDto)).toEqual({
        description: 'Updated Description',
        id: '1',
        title: 'Updated Title',
      });
    });
  });
});
