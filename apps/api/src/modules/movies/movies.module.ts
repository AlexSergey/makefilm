import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MoviesController } from '../../api/movies.controller';
import { Actor } from './entities/actors.entity';
import { Director } from './entities/directors.entity';
import { Genre } from './entities/genres.entity';
import { Movie } from './entities/movies.entity';
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
