import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Actor } from '../entities/actor.entity';

@Injectable()
export class ActorRepository extends Repository<Actor> {
  constructor(
    @InjectRepository(Actor)
    private readonly actorRepository: Repository<Actor>,
  ) {
    super(actorRepository.target, actorRepository.manager, actorRepository.queryRunner);
  }

  async getActorsWithMovies(): Promise<Actor[]> {
    return await this.actorRepository.find({ relations: ['movies'] });
  }
}
