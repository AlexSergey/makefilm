import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Genre } from '../entities/genre.entity';

@Injectable()
export class GenreRepository extends Repository<Genre> {
  constructor(
    @InjectRepository(Genre)
    private readonly genreRepository: Repository<Genre>,
  ) {
    super(genreRepository.target, genreRepository.manager, genreRepository.queryRunner);
  }

  async getGenresWithActors(): Promise<Genre[]> {
    return await this.genreRepository.find({ relations: ['movies', 'movies.actors'] });
  }

  async getGenresWithDirectors(): Promise<Genre[]> {
    return await this.genreRepository.find({ relations: ['movies', 'movies.directors'] });
  }

  async getGenresWithMovies(): Promise<Genre[]> {
    return await this.genreRepository.find({ relations: ['movies'] });
  }
}
