import { StatusEnum, UserRolesEnum } from '@makefilm/contracts';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

export class UserCreateReqDto {
  @ApiProperty({
    example: 'test@gmail.com',
    required: true,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '1234578910',
    required: true,
  })
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    example: 'username',
    required: true,
  })
  @IsNotEmpty()
  username: string;
}

export class UserResDto {
  @ApiProperty({
    example: `${UserRolesEnum.Unauthorized} ${UserRolesEnum.NotConfirmed} ${UserRolesEnum.User} ${UserRolesEnum.Moderator} ${UserRolesEnum.Admin}`,
    required: true,
  })
  @IsNotEmpty()
  role: UserRolesEnum;

  @ApiProperty({
    example: 'xxx-xxx-xxx-xxx',
    required: true,
  })
  @IsNotEmpty()
  session_id: string;

  @ApiProperty({
    example: `${StatusEnum.NotActive} ${StatusEnum.Active}`,
    required: true,
  })
  @IsNotEmpty()
  status: StatusEnum;

  @ApiProperty({
    example: 'xxx-xxx-xxx-xxx',
    required: true,
  })
  @IsNotEmpty()
  user_id: string;

  @ApiProperty({
    example: 'John Doe',
    required: false,
  })
  @IsOptional()
  username?: string;
}

export class UserUpdateDto {
  @ApiProperty({
    enum: UserRolesEnum,
    required: false,
  })
  @IsOptional()
  @IsEnum(UserRolesEnum)
  role?: UserRolesEnum;

  @ApiProperty({
    enum: StatusEnum,
    required: false,
  })
  @IsOptional()
  @IsEnum(StatusEnum)
  status?: StatusEnum;

  @ApiProperty({
    example: 'username',
    required: false,
  })
  @IsNotEmpty()
  @IsOptional()
  username?: string;
}
