import { IsString, IsUUID } from 'class-validator';
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Movie } from './movies.entity';

@Entity('genres')
export class Genre {
  @IsUUID()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToMany(() => Movie, (movie) => movie.genres, {
    onDelete: 'CASCADE',
  })
  @JoinTable()
  movies: Movie[];

  @Column()
  @IsString()
  name: string;
}
