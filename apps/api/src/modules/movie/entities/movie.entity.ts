import { IsNumber, IsString, IsUUID } from 'class-validator';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Actor } from './actor.entity';
import { Director } from './director.entity';
import { Genre } from './genre.entity';

@Entity()
export class Movie {
  @ManyToMany(() => Actor, (actor) => actor.movies, {
    onDelete: 'CASCADE',
  })
  actors: Actor[];

  @Column('text')
  @IsString()
  description: string;

  @ManyToMany(() => Director, (director) => director.movies, {
    onDelete: 'CASCADE',
  })
  directors: Director[];

  @ManyToMany(() => Genre, (genre) => genre.movies, {
    onDelete: 'CASCADE',
  })
  genres: Genre[];

  @IsUUID()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @IsString()
  thumbnail: string;

  @Column()
  @IsString()
  title: string;

  @Column()
  @IsNumber()
  year: number;
}
