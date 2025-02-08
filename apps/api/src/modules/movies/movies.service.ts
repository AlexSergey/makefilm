import { Actor } from '@makefilm/entities';
import { Director } from '@makefilm/entities';
import { Genre } from '@makefilm/entities';
import { Movie } from '@makefilm/entities';
import { Injectable } from '@nestjs/common';

import { FillDatabaseDto } from './dtos/fill-database.dto';
import { ActorsRepository } from './repositories/actors.repository';
import { DirectorsRepository } from './repositories/directors.repository';
import { GenresRepository } from './repositories/genres.repository';
import { MoviesRepository } from './repositories/movies.repository';

@Injectable()
export class MoviesService {
  constructor(
    private readonly movieRepository: MoviesRepository,
    private readonly actorRepository: ActorsRepository,
    private readonly directorRepository: DirectorsRepository,
    private readonly genreRepository: GenresRepository,
  ) {}

  async createMovie(createMoviesDto: FillDatabaseDto[]): Promise<void> {
    return this.movieRepository.createMovies(createMoviesDto);
  }

  async getActorsWithMovies(): Promise<Actor[]> {
    return await this.actorRepository.getActorsWithMovies();
  }

  async getAllMovies(): Promise<Movie[]> {
    return await this.movieRepository.getAllMovies();
  }

  async getDirectorsWithMovies(): Promise<Director[]> {
    return await this.directorRepository.getDirectorsWithMovies();
  }

  async getGenresWithActors(): Promise<Genre[]> {
    return await this.genreRepository.getGenresWithActors();
  }

  async getGenresWithDirectors(): Promise<Genre[]> {
    return await this.genreRepository.getGenresWithDirectors();
  }

  async getGenresWithMovies(): Promise<Genre[]> {
    return await this.genreRepository.getGenresWithMovies();
  }

  async getMovieById(id: string): Promise<Movie> {
    return await this.movieRepository.getMovieById(id);
  }
}
