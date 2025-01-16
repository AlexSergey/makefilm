import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { Movie } from './entities/movie.entity';

@Injectable()
export class MovieRepository extends Repository<Movie> {
  async findAllMovies(): Promise<Movie[]> {
    return await this.find({ relations: ['actors', 'directors', 'genres'] });
  }

  async findMovieById(id: string): Promise<Movie> {
    return await this.findOne({ relations: ['actors', 'directors', 'genres'], where: { id } });
  }
}
