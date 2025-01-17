import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';

import databaseConfig from '../../common/database/config/database.config';
import loggerConfig from '../../common/logger/config/logger.config';
import appConfig from '../../config/app.config';
import { MovieService } from './movie.service';
import { ActorRepository } from './repositories/actor.repository';
import { DirectorRepository } from './repositories/director.repository';
import { GenreRepository } from './repositories/genre.repository';
import { MovieRepository } from './repositories/movie.repository';

const mockMovies = [
  {
    actors: [{ id: '1', name: 'Actor 1' }],
    description: 'Horror film description',
    directors: [{ id: '1', name: 'Director 1' }],
    genres: [{ id: '1', name: 'Horror' }],
    id: 'b708d314-4527-4ca7-97ed-ab3aab2d9020',
    thumbnail: 'posters/b708d314-4527-4ca7-97ed-ab3aab2d9020.jpeg',
    title: 'The Grudge',
    year: 2020,
  },
];

describe('MovieService', () => {
  let service: MovieService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [appConfig, loggerConfig, databaseConfig],
        }),
      ],
      providers: [
        MovieService,
        {
          provide: MovieRepository,
          useValue: {
            getAllMovies: jest.fn().mockResolvedValue(mockMovies),
            getMovieById: jest.fn().mockResolvedValue(mockMovies[0]),
          },
        },
        {
          provide: DirectorRepository,
          useValue: {
            getDirectorsWithMovies: jest.fn().mockResolvedValue(mockMovies[0].directors),
          },
        },
        {
          provide: ActorRepository,
          useValue: {
            getActorsWithMovies: jest.fn().mockResolvedValue(mockMovies[0].actors),
          },
        },
        {
          provide: GenreRepository,
          useValue: {
            getGenresWithActors: jest.fn().mockResolvedValue(mockMovies[0].genres),
            getGenresWithDirectors: jest.fn().mockResolvedValue(mockMovies[0].genres),
            getGenresWithMovies: jest.fn().mockResolvedValue(mockMovies[0].genres),
          },
        },
        { provide: DataSource, useFactory: jest.fn() },
      ],
    }).compile();

    service = module.get<MovieService>(MovieService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllMovies', () => {
    it('should return all movies', async () => {
      const movies = await service.getAllMovies();
      expect(movies).toEqual(mockMovies);
    });
  });

  describe('getMovieById', () => {
    it('should return a movie by ID', async () => {
      const movie = await service.getMovieById('b708d314-4527-4ca7-97ed-ab3aab2d9020');
      expect(movie).toEqual(mockMovies[0]);
    });
  });

  describe('getActorsWithMovies', () => {
    it('should return actors with movies', async () => {
      const actors = await service.getActorsWithMovies();
      expect(actors).toEqual(mockMovies[0].actors);
    });
  });

  describe('getDirectorsWithMovies', () => {
    it('should return directors with movies', async () => {
      const directors = await service.getDirectorsWithMovies();
      expect(directors).toEqual(mockMovies[0].directors);
    });
  });

  describe('getGenresWithMovies', () => {
    it('should return genres with movies', async () => {
      const genres = await service.getGenresWithMovies();
      expect(genres).toEqual(mockMovies[0].genres);
    });
  });

  describe('getGenresWithActors', () => {
    it('should return genres with actors', async () => {
      const genres = await service.getGenresWithActors();
      expect(genres).toEqual([{ id: '1', name: 'Horror' }]);
    });
  });

  describe('getGenresWithDirectors', () => {
    it('should return genres with directors', async () => {
      const genres = await service.getGenresWithDirectors();
      expect(genres).toEqual([{ id: '1', name: 'Horror' }]);
    });
  });
});
