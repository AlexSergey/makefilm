import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { DataSource } from 'typeorm';

import { ArticleModule } from '@api/modules/article/article.module';
import { CreateArticleDto } from '@api/modules/article/dto';
import { bootstrap } from './mocks/app.init';
import { Clean, createArticles, Data, getLastId } from './mocks/articles.mock';

describe('ArticleController (e2e)', () => {
  let app: INestApplication;

  let clean: Clean;
  let data: Data;

  beforeAll(async () => {
    app = await bootstrap<ArticleModule>(ArticleModule);
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    const dataSource = await app.resolve<DataSource>(DataSource);
    const articles = [
      { description: 'Content 1', title: 'Article 1' },
      { description: 'Content 2', title: 'Article 2' },
      { description: 'Content 3', title: 'Article 3' },
      { description: 'Content 4', title: 'Article 4' },
      { description: 'Content 5', title: 'Article 5' },
      { description: 'Content 6', title: 'Article 6' },
      { description: 'Content 7', title: 'Article 2' },
    ];
    const res = await createArticles(dataSource, articles);
    clean = res.clean;
    data = res.data;
  });

  afterEach(async () => {
    await clean();
  });

  describe('POST /articles', () => {
    it('should create a new article', async () => {
      const dataSource = await app.resolve<DataSource>(DataSource);
      const createArticleDto: CreateArticleDto = {
        description: 'This is a new article content.',
        title: 'New Article',
      };

      const response = await request(app.getHttpServer()).post('/articles').send(createArticleDto).expect(201);

      const id = await getLastId(dataSource);

      expect(response.body.data).toEqual({ ...createArticleDto, id });
    });
  });

  describe('GET /articles', () => {
    it('should return a list of articles', async () => {
      const response = await request(app.getHttpServer()).get('/articles').expect(200);

      expect(response.body.data).toEqual({
        articles: [
          { description: 'Content 1', id: data[0].id, title: 'Article 1' },
          { description: 'Content 2', id: data[1].id, title: 'Article 2' },
          { description: 'Content 3', id: data[2].id, title: 'Article 3' },
          { description: 'Content 4', id: data[3].id, title: 'Article 4' },
          { description: 'Content 5', id: data[4].id, title: 'Article 5' },
          { description: 'Content 6', id: data[5].id, title: 'Article 6' },
          { description: 'Content 7', id: data[6].id, title: 'Article 2' },
        ],
        total: 7,
      });
    });

    it('should return a list of articles with pagination 5 per page ?range=[0,5]', async () => {
      const response = await request(app.getHttpServer()).get('/articles?range=[0,5]').expect(200);

      expect(response.body.data).toEqual({
        articles: [
          { description: 'Content 1', id: data[0].id, title: 'Article 1' },
          { description: 'Content 2', id: data[1].id, title: 'Article 2' },
          { description: 'Content 3', id: data[2].id, title: 'Article 3' },
          { description: 'Content 4', id: data[3].id, title: 'Article 4' },
          { description: 'Content 5', id: data[4].id, title: 'Article 5' },
        ],
        total: 7,
      });

      const response2 = await request(app.getHttpServer()).get('/articles?range=[5,10]').expect(200);

      expect(response2.body.data).toEqual({
        articles: [
          { description: 'Content 6', id: data[5].id, title: 'Article 6' },
          { description: 'Content 7', id: data[6].id, title: 'Article 2' },
        ],
        total: 7,
      });
    });

    it('should handle pagination and filtering ?filter={"title":"Article 2"}', async () => {
      const response = await request(app.getHttpServer()).get('/articles?filter={"title":"Article 2"}').expect(200);
      expect(response.body.data.articles.length).toEqual(2);

      expect(response.body.data).toEqual({
        articles: [
          { description: 'Content 2', id: data[1].id, title: 'Article 2' },
          { description: 'Content 7', id: data[6].id, title: 'Article 2' },
        ],
        total: 2,
      });
    });

    it('should handle pagination and searching ?filter={"q":"test"}', async () => {
      const response = await request(app.getHttpServer()).get('/articles?filter={"q":"Article 2"}').expect(200);
      expect(response.body.data.articles.length).toEqual(2);

      expect(response.body.data).toEqual({
        articles: [
          { description: 'Content 2', id: data[1].id, title: 'Article 2' },
          { description: 'Content 7', id: data[6].id, title: 'Article 2' },
        ],
        total: 2,
      });
      const response2 = await request(app.getHttpServer()).get('/articles?filter={"q":"Article 1"}').expect(200);
      expect(response2.body.data.articles.length).toEqual(1);

      expect(response2.body.data).toEqual({
        articles: [{ description: 'Content 1', id: data[0].id, title: 'Article 1' }],
        total: 1,
      });
    });

    it('should return a list of articles with pagination 5 per page and DESC sorting ?range=[0,5]&sort=["description","DESC"]', async () => {
      const response = await request(app.getHttpServer())
        .get('/articles?range=[0,5]&sort=["description","DESC"]')
        .expect(200);

      expect(response.body.data).toEqual({
        articles: [
          { description: 'Content 7', id: data[6].id, title: 'Article 2' },
          { description: 'Content 6', id: data[5].id, title: 'Article 6' },
          { description: 'Content 5', id: data[4].id, title: 'Article 5' },
          { description: 'Content 4', id: data[3].id, title: 'Article 4' },
          { description: 'Content 3', id: data[2].id, title: 'Article 3' },
        ],
        total: 7,
      });

      const response2 = await request(app.getHttpServer())
        .get('/articles?range=[5,10]&sort=["description","DESC"]')
        .expect(200);

      expect(response2.body.data).toEqual({
        articles: [
          { description: 'Content 2', id: data[1].id, title: 'Article 2' },
          { description: 'Content 1', id: data[0].id, title: 'Article 1' },
        ],
        total: 7,
      });
    });
  });

  describe('GET /articles/:id', () => {
    it('should return a single article by ID', async () => {
      const response = await request(app.getHttpServer()).get(`/articles/${data[0].id}`).expect(200);

      expect(response.body.data).toEqual({ description: 'Content 1', id: data[0].id, title: 'Article 1' });
    });

    it('should return 404 if article not found', async () => {
      await request(app.getHttpServer()).get('/articles/999').expect(404);
    });
  });

  describe('DELETE /articles/:id', () => {
    it('should delete an article by ID', async () => {
      await request(app.getHttpServer()).delete(`/articles/${data[0].id}`).expect(200);
      await request(app.getHttpServer()).get(`/articles/${data[0].id}`).expect(404);

      const response = await request(app.getHttpServer()).get('/articles').expect(200);

      expect(response.body.data).toEqual({
        articles: [
          { description: 'Content 2', id: data[1].id, title: 'Article 2' },
          { description: 'Content 3', id: data[2].id, title: 'Article 3' },
          { description: 'Content 4', id: data[3].id, title: 'Article 4' },
          { description: 'Content 5', id: data[4].id, title: 'Article 5' },
          { description: 'Content 6', id: data[5].id, title: 'Article 6' },
          { description: 'Content 7', id: data[6].id, title: 'Article 2' },
        ],
        total: 6,
      });
    });

    it('should return 404 if article not found for deletion', async () => {
      await request(app.getHttpServer()).delete('/articles/999').expect(404);
    });
  });

  describe('PATCH /articles/:id', () => {
    it('should update an article by ID', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/articles/${data[0].id}`)
        .send({ title: 'Updated Title' })
        .expect(200);

      expect(response.body.data).toEqual({
        description: data[0].description,
        id: data[0].id,
        title: 'Updated Title',
      });
      const response2 = await request(app.getHttpServer()).get('/articles').expect(200);

      expect(response2.body.data).toEqual({
        articles: [
          { description: 'Content 2', id: data[1].id, title: 'Article 2' },
          { description: 'Content 3', id: data[2].id, title: 'Article 3' },
          { description: 'Content 4', id: data[3].id, title: 'Article 4' },
          { description: 'Content 5', id: data[4].id, title: 'Article 5' },
          { description: 'Content 6', id: data[5].id, title: 'Article 6' },
          { description: 'Content 7', id: data[6].id, title: 'Article 2' },
          { description: 'Content 1', id: data[0].id, title: 'Updated Title' },
        ],
        total: 7,
      });
    });

    it('should return 404 if article not found for update', async () => {
      await request(app.getHttpServer()).patch('/articles/999').send({ title: 'Updated Title' }).expect(404);
    });
  });
});
