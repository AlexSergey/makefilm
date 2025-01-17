import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Director } from '../entities/director.entity';

@Injectable()
export class DirectorRepository extends Repository<Director> {
  constructor(
    @InjectRepository(Director)
    private readonly directorRepository: Repository<Director>,
  ) {
    super(directorRepository.target, directorRepository.manager, directorRepository.queryRunner);
  }

  async getDirectorsWithMovies(): Promise<Director[]> {
    return await this.directorRepository.find({ relations: ['movies'] });
  }
}
