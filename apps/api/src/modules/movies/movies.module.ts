import { Actor } from '@makefilm/entities';
import { Director } from '@makefilm/entities';
import { Genre } from '@makefilm/entities';
import { Movie } from '@makefilm/entities';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MoviesController } from '../../api/movies.controller';
import { MoviesService } from './movies.service';
import { ActorsRepository } from './repositories/actors.repository';
import { DirectorsRepository } from './repositories/directors.repository';
import { GenresRepository } from './repositories/genres.repository';
import { MoviesRepository } from './repositories/movies.repository';

@Module({
  controllers: [MoviesController],
  imports: [TypeOrmModule.forFeature([Movie, Actor, Genre, Director])],
  providers: [MoviesService, MoviesRepository, GenresRepository, DirectorsRepository, ActorsRepository],
})
export class MoviesModule {}
