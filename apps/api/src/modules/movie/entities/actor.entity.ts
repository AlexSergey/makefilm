import { Entity, JoinTable, ManyToMany } from 'typeorm';

import { Creator } from './creator.entity';
import { Movie } from './movie.entity';

@Entity()
export class Actor extends Creator {
  @ManyToMany(() => Movie, (movie) => movie.actors, {
    onDelete: 'CASCADE',
  })
  @JoinTable()
  movies: Movie[];
}
