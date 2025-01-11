import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateArticleDto {
  @ApiProperty({
    example: 'description',
    required: true,
  })
  @IsNotEmpty({ message: 'description required' })
  @IsString({ message: 'description must be a string' })
  description: string;

  @ApiProperty({
    example: 'title',
    required: true,
  })
  @IsNotEmpty({ message: 'title required' })
  @IsString({ message: 'title must be a string' })
  title: string;
}

export class UpdateArticleDto {
  @ApiProperty({
    example: 'description',
    required: false,
  })
  @IsNotEmpty({ message: "description can't be a empty string" })
  @IsOptional()
  @IsString({ message: 'description must be a string' })
  description?: string;

  @ApiProperty({
    example: 'title',
    required: false,
  })
  @IsNotEmpty({ message: "title can't be a empty string" })
  @IsOptional()
  @IsString({ message: 'title must be a string' })
  title?: string;
}
