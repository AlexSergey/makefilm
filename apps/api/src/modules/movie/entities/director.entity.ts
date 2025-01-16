import { Entity, JoinTable, ManyToMany } from 'typeorm';

import { Creator } from './creator.entity';
import { Movie } from './movie.entity';

@Entity()
export class Director extends Creator {
  @ManyToMany(() => Movie, (movie) => movie.directors, {
    onDelete: 'CASCADE',
  })
  @JoinTable()
  movies: Movie[];
}
