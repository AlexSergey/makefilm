import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class SignInGoogleReqDto {
  @ApiProperty({
    example: 'googlecreds',
    required: true,
  })
  @IsNotEmpty()
  credential: string;
}

export class SignInReqDto {
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
}

export class SignOutResDto {
  @ApiProperty({
    example: 'ok',
    required: true,
  })
  @IsNotEmpty()
  status: string;
}
