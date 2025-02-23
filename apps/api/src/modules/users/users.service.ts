import { UserRolesEnum } from '@makefilm/contracts';
import { UsersEntity } from '@makefilm/entities';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import bcrypt from 'bcrypt';
import { DeleteResult, Raw, Repository, UpdateResult } from 'typeorm';

import { Pagination } from '../../common/database/decorators/pagination.decorator';
import { Sorting } from '../../common/database/decorators/sort.decorator';
import { getOrder } from '../../common/database/utils/sorting.util';
import { AUTH_URL } from '../../constants/url';
import { JwtService } from '../jwt/jwt.service';
import { FilterUser, GetUserWhere } from './user.types';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private usersRepository: Repository<UsersEntity>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async createUser({
    confirmed,
    email,
    password,
    username,
  }: {
    confirmed?: boolean;
    email: string;
    password?: string;
    username: string;
  }): Promise<UsersEntity> {
    const existingUser = await this.findByEmail(email);

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const user = new UsersEntity();
    user.email = email;
    user.username = username;

    if (typeof password === 'string' && password.length > 0) {
      user.password = await bcrypt.hash(password, bcrypt.genSaltSync(10));
    }

    if (confirmed) {
      user.role = UserRolesEnum.User;
    }

    return await this.usersRepository.save(user);
  }

  async deleteUser(id: string): Promise<DeleteResult> {
    return this.usersRepository.delete({ id });
  }

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

  async getUsers(
    { skip, take }: Pagination,
    sort: Sorting,
    filter: FilterUser | null,
    search: null | string,
  ): Promise<[UsersEntity[], number]> {
    const order = getOrder(sort);
    let where: GetUserWhere = filter && filter.role && typeof search !== 'string' ? [{ role: filter.role }] : [];

    if (typeof search === 'string') {
      ['username', 'email'].forEach((searchFields) => {
        where = where.concat(
          filter && filter.role
            ? [
                {
                  role: filter.role,
                  [searchFields]: Raw((alias) => `LOWER(${alias}) Like '%${search.toLowerCase()}%'`),
                },
              ]
            : [{ [searchFields]: Raw((alias) => `LOWER(${alias}) Like '%${search.toLowerCase()}%'`) }],
        );
      });
    }

    return this.usersRepository.findAndCount(
      !order
        ? {
            skip,
            take,
            where,
          }
        : {
            order,
            skip,
            take,
            where,
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

  userConfirmationUrl(user: UsersEntity): string {
    const confirmationToken = this.jwtService.createToken(
      user,
      this.configService.getOrThrow('jwt.confirmationSecret'),
      '30d',
    );

    return [
      this.configService.getOrThrow('app.apiUrl'),
      '/',
      this.configService.getOrThrow('app.apiPrefix'),
      `/${AUTH_URL}/confirmation?token=`,
      confirmationToken,
    ].join('');
  }
}
