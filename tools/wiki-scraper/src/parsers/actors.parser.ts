import { Actions, ValidMovie } from '../types/movie.type';
import { ParserInterface } from './parser.interface';

const skipSymbols = ['?'];

export interface Actor {
  name: string;
  type: Actions[];
}

export interface ActorFinal {
  id: string;
  name: string;
  type: Actions[];
}

const cacheActors = new Set<string>();
const dbActors = new Set<Actor>();

export const getParsedActors = (): Actor[] => {
  return [...dbActors];
};

export class Actors implements ParserInterface<Actor> {
  _cast: string[];

  constructor(movie: ValidMovie) {
    this._cast = movie.cast;
  }

  async parse(): Promise<Actor[]> {
    const actorsStriped = this._cast.filter((a) => !skipSymbols.includes(a));
    const uniqueActors = actorsStriped.filter((a) => !cacheActors.has(a));

    uniqueActors.forEach((actor) => {
      cacheActors.add(actor);
    });

    uniqueActors.forEach((actor) => {
      dbActors.add({
        name: actor,
        type: [Actions.actor],
      });
    });

    const tempArray = [...dbActors];

    return actorsStriped
      .filter(Boolean)
      .map((actor) => tempArray.find((a) => actor === a.name))
      .filter((item) => item !== undefined);
  }
}
