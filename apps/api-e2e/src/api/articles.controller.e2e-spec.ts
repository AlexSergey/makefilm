import { ArticlesEntity } from '@api/modules/articles/entities/articles.entity';
import { rest } from '@makefilm/axios';
import { CreateArticleDto } from '@makefilm/contracts';
import { DatabaseManager, databaseManager } from '@makefilm/testing-database-manager';

describe('ArticlesController (e2e)', () => {
  let dbManager: DatabaseManager;

  beforeAll(async () => {
    dbManager = await databaseManager();
  });

  afterAll(async () => {
    await dbManager.destroy();
  });

  describe('POST /articles', () => {
    it('should create a new article', async () => {
      const createArticleDto: CreateArticleDto = {
        description: 'This is a new article content.',
        title: 'New Article',
      };

      const res = await rest.post('/articles', createArticleDto);

      expect(res.status).toBe(201);
      expect(res.data).toEqual({
        data: { ...createArticleDto, id: res.data.data.id },
        message: 'Resource created successfully',
        status: 201,
        success: true,
      });
    });
  });

  describe('GET /articles', () => {
    it('should return a list of articles', async () => {
      const res = await rest.get('/articles');

      expect(res.status).toBe(200);
      expect(res.data).toEqual({
        data: {
          articles: [
            {
              description: 'This is a new article content.',
              id: res.data.data.articles[0].id,
              title: 'New Article',
            },
          ],
          total: 1,
        },
        message: 'Request successful',
        status: 200,
        success: true,
      });
    });

    describe('Filtering for GET /articles', () => {
      beforeAll(async () => {
        await dbManager.cleanupDatabase();

        for (const item of Array.from(Array(7).keys())) {
          const articlesRepository = dbManager.getDatasource().getRepository(ArticlesEntity);
          const index = item + 1;
          const article = articlesRepository.create({
            description: `Content ${index}`,
            title: `Article ${index === 7 ? 2 : index}`,
          });

          await articlesRepository.save(article);
        }
      });

      it('should return a list of articles with pagination 5 per page ?range=[0,5]', async () => {
        const res = await rest.get('/articles?range=[0,5]');
        const articles = res.data.data.articles;

        expect(res.status).toBe(200);
        expect(res.data.data).toEqual({
          articles: [
            { description: 'Content 1', id: articles[0].id, title: 'Article 1' },
            { description: 'Content 2', id: articles[1].id, title: 'Article 2' },
            { description: 'Content 3', id: articles[2].id, title: 'Article 3' },
            { description: 'Content 4', id: articles[3].id, title: 'Article 4' },
            { description: 'Content 5', id: articles[4].id, title: 'Article 5' },
          ],
          total: 7,
        });

        const resNext = await rest.get('/articles?range=[5,10]');
        const articlesNext = resNext.data.data.articles;

        expect(resNext.status).toBe(200);
        expect(resNext.data.data).toEqual({
          articles: [
            { description: 'Content 6', id: articlesNext[0].id, title: 'Article 6' },
            { description: 'Content 7', id: articlesNext[1].id, title: 'Article 2' },
          ],
          total: 7,
        });
      });

      it('should handle pagination and filtering ?filter={"title":"Article 2"}', async () => {
        const res = await rest.get('/articles?filter={"title":"Article 2"}');
        expect(res.data.data.articles.length).toEqual(2);

        expect(res.data.data).toEqual({
          articles: [
            { description: 'Content 2', id: res.data.data.articles[0].id, title: 'Article 2' },
            { description: 'Content 7', id: res.data.data.articles[1].id, title: 'Article 2' },
          ],
          total: 2,
        });
      });

      it('should handle pagination and searching ?filter={"q":"test"}', async () => {
        const res = await rest.get('/articles?filter={"q":"Article 2"}');
        expect(res.data.data.articles.length).toEqual(2);

        expect(res.data.data).toEqual({
          articles: [
            { description: 'Content 2', id: res.data.data.articles[0].id, title: 'Article 2' },
            { description: 'Content 7', id: res.data.data.articles[1].id, title: 'Article 2' },
          ],
          total: 2,
        });
        const res2 = await rest.get('/articles?filter={"q":"Article 1"}');
        expect(res2.data.data.articles.length).toEqual(1);

        expect(res2.data.data).toEqual({
          articles: [{ description: 'Content 1', id: res2.data.data.articles[0].id, title: 'Article 1' }],
          total: 1,
        });
      });

      it('should return a list of articles with pagination 5 per page and DESC sorting ?range=[0,5]&sort=["description","DESC"]', async () => {
        const res = await rest.get('/articles?range=[0,5]&sort=["description","DESC"]');

        expect(res.data.data).toEqual({
          articles: [
            { description: 'Content 7', id: res.data.data.articles[0].id, title: 'Article 2' },
            { description: 'Content 6', id: res.data.data.articles[1].id, title: 'Article 6' },
            { description: 'Content 5', id: res.data.data.articles[2].id, title: 'Article 5' },
            { description: 'Content 4', id: res.data.data.articles[3].id, title: 'Article 4' },
            { description: 'Content 3', id: res.data.data.articles[4].id, title: 'Article 3' },
          ],
          total: 7,
        });

        const res2 = await rest.get('/articles?range=[5,10]&sort=["description","DESC"]');

        expect(res2.data.data).toEqual({
          articles: [
            { description: 'Content 2', id: res2.data.data.articles[0].id, title: 'Article 2' },
            { description: 'Content 1', id: res2.data.data.articles[1].id, title: 'Article 1' },
          ],
          total: 7,
        });
      });
    });
  });

  describe('GET /articles/:id', () => {
    it('should return a single article by ID', async () => {
      const res = await rest.get('/articles');
      const res2 = await rest.get(`/articles/${res.data.data.articles[0].id}`);

      expect(res2.data.data).toEqual({
        description: 'Content 1',
        id: res.data.data.articles[0].id,
        title: 'Article 1',
      });
    });

    it('should return 404 if article not found', async () => {
      try {
        await rest.get('/articles/999');
      } catch (error) {
        expect(error.status).toBe(404);
      }
    });
  });

  describe('DELETE /articles/:id', () => {
    beforeAll(async () => {
      await dbManager.cleanupDatabase();

      for (const item of Array.from(Array(7).keys())) {
        const articlesRepository = dbManager.getDatasource().getRepository(ArticlesEntity);
        const index = item + 1;
        const article = articlesRepository.create({
          description: `Content ${index}`,
          title: `Article ${index === 7 ? 2 : index}`,
        });

        await articlesRepository.save(article);
      }
    });

    it('should delete an article by ID', async () => {
      const res0 = await rest.get('/articles');
      const res = await rest.delete(`/articles/${res0.data.data.articles[0].id}`);

      expect(res.status).toBe(200);

      const res2 = await rest.get('/articles');

      expect(res2.data.data.articles).toEqual([
        { description: 'Content 2', id: res2.data.data.articles[0].id, title: 'Article 2' },
        { description: 'Content 3', id: res2.data.data.articles[1].id, title: 'Article 3' },
        { description: 'Content 4', id: res2.data.data.articles[2].id, title: 'Article 4' },
        { description: 'Content 5', id: res2.data.data.articles[3].id, title: 'Article 5' },
        { description: 'Content 6', id: res2.data.data.articles[4].id, title: 'Article 6' },
        { description: 'Content 7', id: res2.data.data.articles[5].id, title: 'Article 2' },
      ]);
    });

    it('should return 404 if article not found for deletion', async () => {
      try {
        await rest.delete('/articles/999');
      } catch (error) {
        expect(error.status).toBe(404);
      }
    });
  });

  describe('PATCH /articles/:id', () => {
    beforeAll(async () => {
      await dbManager.cleanupDatabase();

      for (const item of Array.from(Array(7).keys())) {
        const articlesRepository = dbManager.getDatasource().getRepository(ArticlesEntity);
        const index = item + 1;
        const article = articlesRepository.create({
          description: `Content ${index}`,
          title: `Article ${index === 7 ? 2 : index}`,
        });

        await articlesRepository.save(article);
      }
    });

    it('should update an article by ID', async () => {
      const res0 = await rest.get('/articles');
      const res = await rest.patch(`/articles/${res0.data.data.articles[0].id}`, { title: 'Updated Title' });

      expect(res.data.data).toEqual({
        description: res0.data.data.articles[0].description,
        id: res0.data.data.articles[0].id,
        title: 'Updated Title',
      });

      const res2 = await rest.get('/articles');

      expect(res2.data.data).toEqual({
        articles: [
          { description: 'Content 2', id: res2.data.data.articles[0].id, title: 'Article 2' },
          { description: 'Content 3', id: res2.data.data.articles[1].id, title: 'Article 3' },
          { description: 'Content 4', id: res2.data.data.articles[2].id, title: 'Article 4' },
          { description: 'Content 5', id: res2.data.data.articles[3].id, title: 'Article 5' },
          { description: 'Content 6', id: res2.data.data.articles[4].id, title: 'Article 6' },
          { description: 'Content 7', id: res2.data.data.articles[5].id, title: 'Article 2' },
          { description: 'Content 1', id: res2.data.data.articles[6].id, title: 'Updated Title' },
        ],
        total: 7,
      });
    });

    it('should return 404 if article not found for update', async () => {
      try {
        await rest.patch('/articles/999');
      } catch (error) {
        expect(error.status).toBe(404);
      }
    });
  });
});
