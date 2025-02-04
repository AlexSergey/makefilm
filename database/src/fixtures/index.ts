import { Actor, Director, Genre, Movie } from '@makefilm/entities';
import { mock1Movie } from '@makefilm/mock-data';

import { dataSource } from '../data-source';
import { FillDatabaseDto } from './fill-database.dto';

export const fillDatabase = async (createMoviesDto: FillDatabaseDto[], ds = dataSource) => {
  await ds.initialize();

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
};

fillDatabase(mock1Movie);
