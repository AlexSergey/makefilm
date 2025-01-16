import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';

import databaseConfig from '../../common/database/config/database.config';
import { TypeOrmConfigService } from '../../common/database/typeorm-config.service';
import loggerConfig from '../../common/logger/config/logger.config';
import appConfig from '../../config/app.config';
import { Actor } from './entities/actor.entity';
import { Director } from './entities/director.entity';
import { Genre } from './entities/genre.entity';
import { Movie } from './entities/movie.entity';
import { MovieService } from './movie.service';

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

const moviesMockRepo = {
  find: jest.fn().mockResolvedValue(mockMovies),
  findOne: jest.fn().mockResolvedValue(mockMovies[0]),
};

const actorsMockRepo = {
  find: jest.fn().mockResolvedValue(mockMovies[0].actors),
};

const genresMockRepo = {
  find: jest.fn().mockResolvedValue(mockMovies[0].genres),
};

const directorsMockRepo = {
  find: jest.fn().mockResolvedValue(mockMovies[0].directors),
};

describe('MovieService', () => {
  let service: MovieService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [appConfig, loggerConfig, databaseConfig],
        }),
        TypeOrmModule.forRootAsync({
          dataSourceFactory: async (options: DataSourceOptions) => {
            return new DataSource(options).initialize();
          },
          useClass: TypeOrmConfigService,
        }),
      ],
      providers: [
        MovieService,
        {
          provide: getRepositoryToken(Movie),
          useValue: moviesMockRepo,
        },
        {
          provide: getRepositoryToken(Actor),
          useValue: actorsMockRepo,
        },
        {
          provide: getRepositoryToken(Director),
          useValue: directorsMockRepo,
        },
        {
          provide: getRepositoryToken(Genre),
          useValue: genresMockRepo,
        },
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
      expect(moviesMockRepo.find).toHaveBeenCalled();
    });
  });

  describe('getMovieById', () => {
    it('should return a movie by ID', async () => {
      const movie = await service.getMovieById('b708d314-4527-4ca7-97ed-ab3aab2d9020');
      expect(movie).toEqual(mockMovies[0]);
      expect(moviesMockRepo.findOne).toHaveBeenCalledWith({
        relations: ['actors', 'directors', 'genres'],
        where: { id: 'b708d314-4527-4ca7-97ed-ab3aab2d9020' },
      });
    });
  });

  describe('getActorsWithMovies', () => {
    it('should return actors with movies', async () => {
      const actors = await service.getActorsWithMovies();
      expect(actors).toEqual(mockMovies[0].actors);
      expect(actorsMockRepo.find).toHaveBeenCalled();
    });
  });

  describe('getDirectorsWithMovies', () => {
    it('should return directors with movies', async () => {
      const directors = await service.getDirectorsWithMovies();
      expect(directors).toEqual(mockMovies[0].directors);
      expect(directorsMockRepo.find).toHaveBeenCalled();
    });
  });

  describe('getGenresWithMovies', () => {
    it('should return genres with movies', async () => {
      const genres = await service.getGenresWithMovies();
      expect(genres).toEqual(mockMovies[0].genres);
      expect(genresMockRepo.find).toHaveBeenCalled();
    });
  });

  describe('getGenresWithActors', () => {
    it('should return genres with actors', async () => {
      const genres = await service.getGenresWithActors();
      expect(genres).toEqual([{ id: '1', name: 'Horror' }]);
      expect(genresMockRepo.find).toHaveBeenCalled();
    });
  });

  describe('getGenresWithDirectors', () => {
    it('should return genres with directors', async () => {
      const genres = await service.getGenresWithDirectors();
      expect(genres).toEqual([{ id: '1', name: 'Horror' }]);
      expect(genresMockRepo.find).toHaveBeenCalled();
    });
  });
});
