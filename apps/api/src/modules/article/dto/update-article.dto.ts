import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateArticleDto {
  @ApiProperty({
    example: 'description',
    required: false,
  })
  @IsNotEmpty()
  description?: string;

  @ApiProperty({
    example: 'title',
    required: false,
  })
  @IsNotEmpty()
  title?: string;
}
