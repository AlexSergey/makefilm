import { UserRolesEnum } from '@makefilm/contracts';
import { UsersEntity } from '@makefilm/entities';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';

import { Pagination } from '../../common/database/decorators/pagination.decorator';
import { Sorting } from '../../common/database/decorators/sort.decorator';
import { getOrder } from '../../common/database/utils/sorting.util';

@Injectable()
export class PasswordService {
  constructor(
    @InjectRepository(UsersEntity)
    private usersRepository: Repository<UsersEntity>,
  ) {}

  findByEmail(email: string): Promise<UsersEntity> {
    return this.usersRepository.findOne({
      where: { email },
    });
  }

  findById(user_id: string): Promise<UsersEntity> {
    return this.usersRepository.findOne({
      where: { id: user_id },
    });
  }

  async getUsers({ skip, take }: Pagination, sorting: Sorting): Promise<[UsersEntity[], number]> {
    const order = getOrder(sorting);

    return this.usersRepository.findAndCount(
      !order
        ? {
            skip,
            take,
          }
        : {
            order,
            skip,
            take,
          },
    );
  }

  async resetPasswordRequest(email: string): Promise<UsersEntity> {
    const existingUser = await this.findByEmail(email);

    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    return existingUser;
  }

  async updateUser(
    user_id: string,
    data: Partial<Omit<UsersEntity, 'created_at' | 'id' | 'updated_at'>>,
  ): Promise<UpdateResult> {
    return this.usersRepository.update(user_id, data);
  }

  userConfirmation(user_id: string): Promise<UpdateResult> {
    return this.usersRepository.update(user_id, {
      role: UserRolesEnum.User,
    });
  }
}
