import { Injectable } from '@nestjs/common';

import { FillDatabaseDto } from './dtos/fill-database.dto';
import { Actor } from './entities/actor.entity';
import { Director } from './entities/director.entity';
import { Genre } from './entities/genre.entity';
import { Movie } from './entities/movie.entity';
import { ActorRepository } from './repositories/actor.repository';
import { DirectorRepository } from './repositories/director.repository';
import { GenreRepository } from './repositories/genre.repository';
import { MovieRepository } from './repositories/movie.repository';

@Injectable()
export class MovieService {
  constructor(
    private readonly movieRepository: MovieRepository,
    private readonly actorRepository: ActorRepository,
    private readonly directorRepository: DirectorRepository,
    private readonly genreRepository: GenreRepository,
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
