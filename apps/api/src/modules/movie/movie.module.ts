import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MovieController } from '../../api/movie.controller';
import { Actor } from './entities/actor.entity';
import { Director } from './entities/director.entity';
import { Genre } from './entities/genre.entity';
import { Movie } from './entities/movie.entity';
import { MovieService } from './movie.service';

@Module({
  controllers: [MovieController],
  imports: [TypeOrmModule.forFeature([Movie, Actor, Genre, Director])],
  providers: [MovieService],
})
export class MovieModule {}
