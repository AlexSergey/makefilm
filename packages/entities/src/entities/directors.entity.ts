import { Entity, JoinTable, ManyToMany } from 'typeorm';

import { Creator } from './creators.entity';
import { Movie } from './movies.entity';

@Entity('directors')
export class Director extends Creator {
  @ManyToMany(() => Movie, (movie) => movie.directors, {
    onDelete: 'CASCADE',
  })
  @JoinTable()
  movies: Movie[];
}
