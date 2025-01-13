import axios from 'axios';
import * as cheerio from 'cheerio';

import { Actions, ValidMovie } from '../types/movie.type';
import { ParserInterface } from './parser.interface';

const wikiUrl = 'https://en.wikipedia.org/api/rest_v1/page/summary/';

export interface Director {
  name: string;
  type: Actions[];
}

const cacheDirector = new Set<string>();
const dbDirectors = new Set<Director>();

export const getParsedDirectors = (): Director[] => {
  return [...dbDirectors];
};

export class Directors implements ParserInterface<Director> {
  _movie: ValidMovie;

  constructor(movie: ValidMovie) {
    this._movie = movie;
  }

  async parse(): Promise<Director[] | void> {
    if (!this._movie.href) {
      return;
    }
    const directors = await this.parseDirectors(this._movie.href);

    if (!directors) {
      return;
    }
    if (Array.isArray(directors) && directors.length === 0) {
      return;
    }

    const uniqueDirectors = directors.filter((a) => !cacheDirector.has(a));

    uniqueDirectors.forEach((director) => {
      cacheDirector.add(director);
    });

    uniqueDirectors.forEach((director) => {
      dbDirectors.add({
        name: director,
        type: [Actions.director],
      });
    });

    const tempArray = [...dbDirectors];

    return uniqueDirectors
      .map((director) => tempArray.find((a) => director === a.name))
      .filter((item) => item !== undefined);
  }

  async parseDirectors(url: string): Promise<string[] | void> {
    try {
      const d = await axios.get(wikiUrl + url);

      const e = await axios.get(d.data?.content_urls?.desktop?.page, { responseType: 'document' });
      const $ = cheerio.load(e.data);

      const search = $('.infobox th')
        .filter(function () {
          return $(this).text().toLowerCase().indexOf('Directed by'.toLowerCase()) >= 0;
        })
        .first();

      const directedBy = search.siblings().get(0);

      if (directedBy) {
        const items = $(directedBy).find('a');

        if (items.length > 0) {
          if (items.length > 1) {
            return items
              .map(function () {
                return $(this).text().trim();
              })
              .get();
          } else if (items.length === 1) {
            const director = items.text();

            return director
              .replace(/ and /g, ', ')
              .replace(/\[\d+\]/, '')
              .split(', ');
          }
        }
      }
    } catch (e) {
      console.error(e);

      return;
    }
  }
}
