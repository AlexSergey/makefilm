import { MoviesModule } from '@api/modules/movies/movies.module';
import { MoviesService } from '@api/modules/movies/movies.service';
import { rest } from '@makefilm/axios';
import { DatabaseManager, databaseManager } from '@makefilm/testing-database-manager';
import { mock1Movie } from '@makefilm/testing-mock-data';
import { INestApplication } from '@nestjs/common';

import { bootstrap } from '../app/app.bootstrap';

describe('MoviesController (e2e)', () => {
  let dbManager: DatabaseManager;

  beforeAll(async () => {
    const app: INestApplication = await bootstrap<MoviesModule>(MoviesModule);
    const service = app.get<MoviesService>(MoviesService);
    await service.createMovie(mock1Movie);
    dbManager = await databaseManager();
  });

  afterAll(async () => {
    await dbManager.destroy();
  });

  it('/movies (GET)', async () => {
    const res = await rest.get('/movies');
    expect(res.data.data).toEqual([
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
    const res = await rest.get(`/movies/${movieId}`);
    expect(res.data.data).toEqual({
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
    const res = await rest.get('/movies/actors');
    expect(res.data.data).toEqual([
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
    const res = await rest.get('/movies/directors');
    expect(res.data.data).toEqual([
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
    const res = await rest.get('/movies/genres');
    expect(res.data.data).toEqual([
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
});
