import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateArticleDto {
  @ApiProperty({
    example: 'description',
    required: true,
  })
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: 'title',
    required: true,
  })
  @IsNotEmpty()
  title: string;
}
