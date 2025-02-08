import { Entity, JoinTable, ManyToMany } from 'typeorm';

import { Creator } from './creators.entity';
import { Movie } from './movies.entity';

@Entity('actors')
export class Actor extends Creator {
  @ManyToMany(() => Movie, (movie) => movie.actors, {
    onDelete: 'CASCADE',
  })
  @JoinTable()
  movies: Movie[];
}
