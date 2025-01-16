import { Actor } from '../parsers/actors.parser';
import { Director } from '../parsers/director.parser';
import { Genre } from '../parsers/genre.parser';

export enum Actions {
  actor = 'actor',
  director = 'director',
}

export interface ModifiedMovie {
  actors: Actor[];
  description: string;
  directors: Director[];
  genres: Genre[];
  id: string;
  thumbnail: string;
  title: string;
  year: number;
}

export interface Movie {
  cast?: string[];
  extract?: string;
  genres?: string[];
  href?: string;
  thumbnail?: string;
  thumbnail_height?: number;
  thumbnail_width?: number;
  title?: string;
  year?: number;
}

export interface ValidMovie {
  cast: string[];
  extract: string;
  genres: string[];
  href: string;
  thumbnail: string;
  thumbnail_height: number;
  thumbnail_width: number;
  title: string;
  year: number;
}
