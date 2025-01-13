import fg from 'fast-glob';
import { existsSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { v4 as uuidv4 } from 'uuid';

import { Actor, ActorFinal, Actors, getParsedActors } from './parsers/actors.parser';
import { Director, Directors, getParsedDirectors } from './parsers/director.parser';
import { Genre, Genres, getParsedGenres } from './parsers/genre.parser';
import { Actions, ModifiedMovie, Movie, ValidMovie } from './types/movie.type';
import { compilePostersFolderPath } from './utils/compile-posters-folder-path';
import { createFolder } from './utils/create-folders';
import { download } from './utils/download';
import { getPosterName } from './utils/get-poster-name';
import { sleep } from './utils/sleep-random';

export interface DirectorFinal {
  id: string;
  name: string;
  type: Actions[];
}
const posters = '/posters/';

export class Parser {
  __rawData: Movie[] = [];
  __root: string;
  __validData: ValidMovie[] = [];

  constructor(root: string) {
    this.__root = root;
  }

  _getData(): string[] {
    return fg.sync(join(this.__root, 'src', 'data2', '*.json'));
  }

  _validate = (movie: Movie): boolean => {
    if (!movie) {
      return false;
    }
    if (typeof movie.title !== 'string') {
      return false;
    }
    if (movie.title === '') {
      return false;
    }
    if (typeof movie.thumbnail !== 'string') {
      return false;
    }
    if (movie.thumbnail === '') {
      return false;
    }
    if (typeof movie.href !== 'string') {
      return false;
    }
    if (movie.href === '') {
      return false;
    }
    if (typeof movie.year !== 'number') {
      return false;
    }
    if (!Array.isArray(movie.cast)) {
      return false;
    }
    if (!Array.isArray(movie.genres)) {
      return false;
    }

    return true;
  };

  async downloadPoster(thumbnail: string, id: string): Promise<string | void> {
    const name = getPosterName(thumbnail, 'https://upload.wikimedia.org/');
    const postersFolder = compilePostersFolderPath(this.__root, [posters]);
    createFolder(postersFolder);
    const posterPath = join(postersFolder, `${id}---${name}`);

    if (!existsSync(posterPath)) {
      const state = await download(thumbnail, posterPath);
      if (!state) {
        console.error('Failed to download poster', posterPath, thumbnail);

        return;
      }

      return relative(this.__root, posterPath);
    } else {
      console.log(`The poster: ${posterPath} is already exists`);

      return posterPath;
    }
  }

  getRawData(): Movie[] {
    return this.__rawData;
  }

  getValidData(): ValidMovie[] {
    return this.__validData;
  }

  async parse(parsedFolder: string): Promise<[ModifiedMovie[], ActorFinal[], DirectorFinal[], Genre[]]> {
    const modifiedMovies: ModifiedMovie[] = [];

    for (let i = 0, l = this.__validData.length; i < l; i++) {
      const movie = this.__validData[i];

      if (!movie) {
        console.error(`[${i}]: Movie not found`);
        continue;
      }

      const directors = await new Directors(movie).parse();

      if (!directors) {
        console.error(`[${i}]: Movie: ${movie.title} parsing error. Can't parse directors`);
        continue;
      }

      await new Actors(movie).parse();
    }
    const directorsFinal: DirectorFinal[] = [];
    const actorsFinal: ActorFinal[] = [];

    const directors = getParsedDirectors();
    const actors = getParsedActors();

    const existedDirectors: DirectorFinal[] = existsSync(join(parsedFolder, 'directors.json'))
      ? JSON.parse(readFileSync(join(parsedFolder, 'directors.json'), 'utf8'))
      : [];

    const getDirectorId = (director: Director): string => {
      const id = uuidv4();

      if (existedDirectors.length > 0) {
        const existed = existedDirectors.find((d) => d.name === director.name);

        if (existed) {
          return existed.id;
        }
      }

      return id;
    };

    directors.forEach((director) => {
      const id = getDirectorId(director);

      if (actors.find((actor) => actor.name === director.name)) {
        directorsFinal.push({
          id,
          ...director,
          type: [Actions.director, Actions.actor],
        });

        return;
      }
      directorsFinal.push({
        id,
        ...director,
      });
    });

    const existedActors: ActorFinal[] = existsSync(join(parsedFolder, 'actors.json'))
      ? JSON.parse(readFileSync(join(parsedFolder, 'actors.json'), 'utf8'))
      : [];

    const getActorId = (actor: Actor): string => {
      const id = uuidv4();

      if (existedActors.length > 0) {
        const existed = existedActors.find((a) => a.name === actor.name);

        if (existed) {
          return existed.id;
        }
      }

      return id;
    };

    actors.forEach((actor) => {
      const id = getActorId(actor);
      const dir = directorsFinal.find((director) => actor.name === director.name);

      if (dir) {
        actorsFinal.push({
          id: typeof dir.id === 'string' ? dir.id : id,
          ...actor,
          type: [Actions.director, Actions.actor],
        });

        return;
      }

      actorsFinal.push({
        id,
        ...actor,
      });
    });

    // eslint-disable-next-line no-warning-comments
    // TODO:
    // Parse photo directors and actors here

    for (let i = 0, l = this.__validData.length; i < l; i++) {
      const movie = this.__validData[i];

      if (!movie) {
        console.error(`[${i}]: Movie not found`);
        continue;
      }

      const existedRes: ModifiedMovie[] = existsSync(join(parsedFolder, 'movies.json'))
        ? JSON.parse(readFileSync(join(parsedFolder, 'movies.json'), 'utf8'))
        : [];

      const existedMovie = existedRes.find((m) => m.title === movie.title);

      const id = existedMovie ? existedMovie.id : uuidv4();

      const posterPath = await this.downloadPoster(movie.thumbnail, id);

      if (!posterPath) {
        continue;
      }

      const directors = getParsedDirectors();

      if (!directors) {
        console.error(`[${i}]: Movie: ${movie.title} parsing error. Can't parse directors`);
        continue;
      }

      const dirs = directorsFinal.filter((director) => directors.find((dir) => dir.name === director.name));

      if (dirs.length === 0) {
        continue;
      }
      const actors = getParsedActors();

      const acts = actorsFinal.filter((actor) => actors.find((a) => a.name === actor.name));

      if (acts.length === 0) {
        continue;
      }

      const genres = await new Genres(movie).parse();

      if (genres.length === 0) {
        console.error(`[${i}]: Movie: ${movie.title} parsing error. Genres is empty`);
        continue;
      }

      const modifiedMovie: ModifiedMovie = {
        id,
        ...movie,
        cast: acts,
        directors: dirs,
        genres,
        thumbnail: posterPath,
      };

      modifiedMovies.push(modifiedMovie);

      console.log(`[${i}]: Movie: ${movie.title} successfully parsed`);
      await sleep();
    }

    return [modifiedMovies, actorsFinal, directorsFinal, getParsedGenres()];
  }

  prepare(): this {
    const data = this._getData();
    for (let i = 0, l = data.length; i < l; i++) {
      const file = data[i];
      if (file) {
        const movies: Movie[] = JSON.parse(readFileSync(file, 'utf8'));
        movies.forEach((movie: Movie) => {
          this.__rawData.push(movie);
          const isValid = this._validate(movie);
          if (isValid) {
            this.__validData.push(movie as unknown as ValidMovie);
          }
        });
      }
    }

    return this;
  }
}
