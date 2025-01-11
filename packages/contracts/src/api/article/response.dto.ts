import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';

export class ArticleResponseDto {
  @IsString()
  description: string;

  @IsString()
  id: string;

  @IsString({ message: 'title must be a string' })
  title: string;
}

export class CreateArticleResponseDto extends ArticleResponseDto {}

export class GetArticleResponseDto extends ArticleResponseDto {}

export class GetArticlesResponseDto {
  @IsArray()
  @Type(() => ArticleResponseDto)
  @ValidateNested({ each: true })
  articles: ArticleResponseDto[];

  @IsNumber()
  total: number;
}
