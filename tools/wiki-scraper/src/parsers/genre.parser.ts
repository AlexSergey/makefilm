import { v4 as uuidv4 } from 'uuid';

import { ValidMovie } from '../types/movie.type';
import { ParserInterface } from './parser.interface';

export interface Genre {
  id: string;
  name: string;
}

const cacheGenres = new Set<string>();
const dbGenres = new Set<Genre>();

export const getParsedGenres = (): Genre[] => {
  return [...dbGenres];
};

export class Genres implements ParserInterface<Genre> {
  _genres: string[];

  constructor(movie: ValidMovie) {
    this._genres = movie.genres;
  }

  async parse(): Promise<Genre[]> {
    const uniqueGenres = this._genres.filter((a) => !cacheGenres.has(a));

    uniqueGenres.forEach((genre) => {
      cacheGenres.add(genre);
    });

    uniqueGenres.forEach((genre) => {
      dbGenres.add({ id: uuidv4(), name: genre });
    });

    const tempArray = [...dbGenres];

    return uniqueGenres
      .filter(Boolean)
      .map((genre) => tempArray.find((a) => genre === a.name))
      .filter((genre) => genre !== undefined);
  }
}
