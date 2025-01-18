import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { FillDatabaseDto } from '../dtos/fill-database.dto';
import { Actor } from '../entities/actors.entity';
import { Director } from '../entities/directors.entity';
import { Genre } from '../entities/genres.entity';
import { Movie } from '../entities/movies.entity';

@Injectable()
export class MoviesRepository extends Repository<Movie> {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
    private dataSource: DataSource,
  ) {
    super(movieRepository.target, movieRepository.manager, movieRepository.queryRunner);
  }

  async createMovies(createMoviesDto: FillDatabaseDto[], ds = this.dataSource): Promise<void> {
    for (const createMovieDto of createMoviesDto) {
      const queryRunner = ds.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        const genres = await Promise.all(
          createMovieDto.genres.map(async (genreData) => {
            let genre = await queryRunner.manager.findOne(Genre, { where: { id: genreData.id } });
            if (!genre) {
              genre = queryRunner.manager.create(Genre, genreData);
              genre = await queryRunner.manager.save(genre);
            }

            return genre;
          }),
        );

        const actors = await Promise.all(
          createMovieDto.actors.map(async (actorData) => {
            let actor = await queryRunner.manager.findOne(Actor, { where: { id: actorData.id } });
            if (!actor) {
              actor = queryRunner.manager.create(Actor, actorData);
              actor = await queryRunner.manager.save(actor);
            }

            return actor;
          }),
        );

        const directors = await Promise.all(
          createMovieDto.directors.map(async (directorData) => {
            let director = await queryRunner.manager.findOne(Director, { where: { id: directorData.id } });
            if (!director) {
              director = queryRunner.manager.create(Director, directorData);
              director = await queryRunner.manager.save(director);
            }

            return director;
          }),
        );

        let movie = await queryRunner.manager.findOne(Movie, { where: { id: createMovieDto.id } });

        if (!movie) {
          movie = queryRunner.manager.create(Movie, {
            description: createMovieDto.description,
            id: createMovieDto.id,
            thumbnail: createMovieDto.thumbnail,
            title: createMovieDto.title,
            year: createMovieDto.year,
          });

          movie = await queryRunner.manager.save(movie);
        }

        movie.actors = actors;
        movie.genres = genres;
        movie.directors = directors;

        await queryRunner.manager.save(movie);

        await queryRunner.commitTransaction();
      } catch (err) {
        await queryRunner.rollbackTransaction();
        throw new Error(err);
      } finally {
        await queryRunner.release();
      }
    }
  }

  async getAllMovies(): Promise<Movie[]> {
    return await this.movieRepository.find({ relations: ['actors', 'directors', 'genres'] });
  }

  async getMovieById(id: string): Promise<Movie> {
    return await this.movieRepository.findOne({ relations: ['actors', 'directors', 'genres'], where: { id } });
  }
}
