import { Actor } from '@api/modules/movies/entities/actors.entity';
import { Director } from '@api/modules/movies/entities/directors.entity';
import { Genre } from '@api/modules/movies/entities/genres.entity';
import { Movie } from '@api/modules/movies/entities/movies.entity';
import { MoviesModule } from '@api/modules/movies/movies.module';
import { MoviesService } from '@api/modules/movies/movies.service';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { DataSource } from 'typeorm';

import { bootstrap } from './app/app.init';
import { mockMovies } from './mocks/movies.mock';

describe('MoviesController (e2e)', () => {
  let app: INestApplication;
  let service: MoviesService;
  let dataSource: DataSource;

  beforeAll(async () => {
    app = await bootstrap<MoviesModule>(MoviesModule);
    dataSource = await app.resolve<DataSource>(DataSource);
    service = app.get<MoviesService>(MoviesService);
    await service.createMovie(mockMovies);
  });

  afterAll(async () => {
    await dataSource.manager.query(`TRUNCATE TABLE "${dataSource.getRepository(Genre).metadata.tableName}" CASCADE`);
    await dataSource.manager.query(`TRUNCATE TABLE "${dataSource.getRepository(Director).metadata.tableName}" CASCADE`);
    await dataSource.manager.query(`TRUNCATE TABLE "${dataSource.getRepository(Actor).metadata.tableName}" CASCADE`);
    await dataSource.manager.query(`TRUNCATE TABLE "${dataSource.getRepository(Movie).metadata.tableName}" CASCADE`);
    await app.close();
  });

  it('/movies (GET)', async () => {
    const response = await request(app.getHttpServer()).get('/movies').expect(200);
    expect(response.body.data).toEqual([
      {
        actors: [
          {
            id: '73273635-2a3b-4216-8d3b-f9a40d5506a4',
            name: 'Actor 1',
            type: ['actor'],
          },
        ],
        description: 'Horror film description',
        directors: [{ id: '73273635-2a3b-4216-8d3b-f9a40d5506a5', name: 'Director 1', type: ['director'] }],
        genres: [{ id: '73273635-2a3b-4216-8d3b-f9a40d5506a6', name: 'Horror' }],
        id: '73273635-2a3b-4216-8d3b-f9a40d5506a7',
        thumbnail: 'posters/73273635-2a3b-4216-8d3b-f9a40d5506a7.jpeg',
        title: 'The Grudge',
        year: 2020,
      },
    ]);
  });

  it('/movies/:id (GET)', async () => {
    const movieId = '73273635-2a3b-4216-8d3b-f9a40d5506a7';
    const response = await request(app.getHttpServer()).get(`/movies/${movieId}`).expect(200);
    expect(response.body.data).toEqual({
      actors: [{ id: '73273635-2a3b-4216-8d3b-f9a40d5506a4', name: 'Actor 1', type: ['actor'] }],
      description: 'Horror film description',
      directors: [{ id: '73273635-2a3b-4216-8d3b-f9a40d5506a5', name: 'Director 1', type: ['director'] }],
      genres: [{ id: '73273635-2a3b-4216-8d3b-f9a40d5506a6', name: 'Horror' }],
      id: '73273635-2a3b-4216-8d3b-f9a40d5506a7',
      thumbnail: 'posters/73273635-2a3b-4216-8d3b-f9a40d5506a7.jpeg',
      title: 'The Grudge',
      year: 2020,
    });
  });

  it('/movies/actors (GET)', async () => {
    const response = await request(app.getHttpServer()).get('/movies/actors').expect(200);
    expect(response.body.data).toEqual([
      {
        id: '73273635-2a3b-4216-8d3b-f9a40d5506a4',
        movies: [
          {
            description: 'Horror film description',
            id: '73273635-2a3b-4216-8d3b-f9a40d5506a7',
            thumbnail: 'posters/73273635-2a3b-4216-8d3b-f9a40d5506a7.jpeg',
            title: 'The Grudge',
            year: 2020,
          },
        ],
        name: 'Actor 1',
        type: ['actor'],
      },
    ]);
  });

  it('/movies/directors (GET)', async () => {
    const response = await request(app.getHttpServer()).get('/movies/directors').expect(200);
    expect(response.body.data).toEqual([
      {
        id: '73273635-2a3b-4216-8d3b-f9a40d5506a5',
        movies: [
          {
            description: 'Horror film description',
            id: '73273635-2a3b-4216-8d3b-f9a40d5506a7',
            thumbnail: 'posters/73273635-2a3b-4216-8d3b-f9a40d5506a7.jpeg',
            title: 'The Grudge',
            year: 2020,
          },
        ],
        name: 'Director 1',
        type: ['director'],
      },
    ]);
  });

  it('/movies/genres (GET)', async () => {
    const response = await request(app.getHttpServer()).get('/movies/genres').expect(200);
    expect(response.body.data).toEqual([
      {
        id: '73273635-2a3b-4216-8d3b-f9a40d5506a6',
        movies: [
          {
            description: 'Horror film description',
            id: '73273635-2a3b-4216-8d3b-f9a40d5506a7',
            thumbnail: 'posters/73273635-2a3b-4216-8d3b-f9a40d5506a7.jpeg',
            title: 'The Grudge',
            year: 2020,
          },
        ],
        name: 'Horror',
      },
    ]);
  });

  afterAll(async () => {
    await app.close();
  });
});
