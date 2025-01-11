import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { validationError } from 'class-validator-flat-formatter';

import {
  ArticleResponseDto,
  CreateArticleResponseDto,
  GetArticleResponseDto,
  GetArticlesResponseDto,
} from './response.dto';

describe('DTO validation tests', () => {
  describe('ArticleResponseDto', () => {
    it('should validate a valid ArticleResponseDto', async () => {
      const article = new ArticleResponseDto();
      article.id = '1';
      article.title = 'Test title';
      article.description = 'Test description';

      const errors = await validate(article);
      expect(errors.length).toBe(0);
    });

    it('should throw validation error for missing required fields', async () => {
      const article = new ArticleResponseDto();

      const errors = await validate(article);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('description');
      expect(errors[1].property).toBe('id');
      expect(errors[2].property).toBe('title');
    });

    it('should throw validation error for invalid field types', async () => {
      const article = new ArticleResponseDto();
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      article.id = 1 as unknown;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      article.title = 2 as unknown;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      article.description = 3 as unknown;

      const errors = await validate(article);
      expect(errors.length).toBeGreaterThan(0);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      expect(errors[0].constraints.isString).toBeDefined();
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      expect(errors[1].constraints.isString).toBeDefined();
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      expect(errors[2].constraints.isString).toBeDefined();
    });
  });

  describe('CreateArticleResponseDto', () => {
    it('should inherit ArticleResponseDto and validate correctly', async () => {
      const dto = new CreateArticleResponseDto();
      dto.id = '1';
      dto.title = 'Title';
      dto.description = 'Description';

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });
  });

  describe('GetArticleResponseDto', () => {
    it('should inherit ArticleResponseDto and validate correctly', async () => {
      const dto = new GetArticleResponseDto();
      dto.id = '1';
      dto.title = 'Title';
      dto.description = 'Description';

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });
  });

  describe('GetArticlesResponseDto', () => {
    it('should validate GetArticlesResponseDto with valid values', async () => {
      const dto = new GetArticlesResponseDto();
      dto.articles = [
        { description: 'Description 1', id: '1', title: 'Article 1' },
        { description: 'Description 2', id: '2', title: 'Article 2' },
      ];
      dto.total = 2;

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should throw validation error when articles array is missing', async () => {
      const dto = new GetArticlesResponseDto();
      dto.total = 2;

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('articles');
    });

    it('should throw validation error when total is not a number', async () => {
      const dto = new GetArticlesResponseDto();
      dto.articles = [{ description: 'Description 1', id: '1', title: 'Article 1' }];
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      dto.total = 'string' as unknown;

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('total');
    });

    it('should throw validation error when articles array contains invalid objects', async () => {
      const dto = plainToClass(GetArticlesResponseDto, {
        articles: [
          { description: 'Description 1', id: '1', title: 'Article 1' },
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          { description: 'Description 2', id: '2', title: 2 as unknown },
        ],
        total: 2,
      });

      const errors = await validate(dto);
      const message = validationError(errors);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('articles');
      expect(message).toBe('articles.1.title: must be a string (isString)');
    });
  });
});
