import { UsersEntity } from '@makefilm/entities';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import bcrypt from 'bcryptjs';

import { UsersService } from '../../users/users.service';

@Injectable()
export class LocalAuthService {
  constructor(private readonly userService: UsersService) {}

  async signIn({ email, password }: { email: string; password: string }): Promise<UsersEntity> {
    const existingUser = await this.userService.findByEmail(email);

    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    if (!existingUser.password) {
      throw new BadRequestException('User or password is not correct');
    }

    const isValid = await bcrypt.compare(password, existingUser.password);

    if (!isValid) {
      throw new NotFoundException('User not found');
    }

    return existingUser;
  }
}
