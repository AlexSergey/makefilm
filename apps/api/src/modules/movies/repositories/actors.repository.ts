import { Actor } from '@makefilm/entities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ActorsRepository extends Repository<Actor> {
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
