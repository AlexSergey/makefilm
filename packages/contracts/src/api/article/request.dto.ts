import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateArticleDto {
  @IsNotEmpty({ message: 'description required' })
  @IsString({ message: 'description must be a string' })
  description: string;

  @IsNotEmpty({ message: 'title required' })
  @IsString({ message: 'title must be a string' })
  title: string;
}

export class UpdateArticleDto {
  @IsNotEmpty({ message: "description can't be a empty string" })
  @IsOptional()
  @IsString({ message: 'description must be a string' })
  description?: string;

  @IsNotEmpty({ message: "title can't be a empty string" })
  @IsOptional()
  @IsString({ message: 'title must be a string' })
  title?: string;
}
