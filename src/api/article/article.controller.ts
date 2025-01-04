import { ZodValidationPipe } from '@anatine/zod-nestjs';
import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Query, UsePipes } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ArticleService } from '../../modules/article/article.service';
import { CreateArticleDto, FilterArticleDto, UpdateArticleDto } from '../../modules/article/dto';
import { Article } from '../../modules/article/values/article.value';

@ApiTags('articles')
@Controller('articles')
@UsePipes(ZodValidationPipe)
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @ApiBody({ type: CreateArticleDto })
  @ApiOperation({ summary: 'Creating a new article' })
  @ApiResponse({ description: 'The article has been successfully created', status: HttpStatus.CREATED })
  @ApiResponse({ description: 'Error creating article', status: HttpStatus.BAD_REQUEST })
  @Post()
  create(@Body() createArticleDto: CreateArticleDto): Promise<Article> {
    return this.articleService.create(createArticleDto);
  }

  @ApiOperation({ summary: 'Get all articles' })
  @ApiQuery({ description: 'Field for sorting', name: 'orderBy', required: false, type: String })
  @ApiQuery({
    description: 'Number of skipping articles (for pagination)',
    name: 'skip',
    required: false,
    type: Number,
  })
  @ApiQuery({
    description: 'Number of articles to return (for pagination)',
    name: 'take',
    required: false,
    type: Number,
  })
  @ApiQuery({ description: 'Filtering by fields', name: 'where', required: false, type: String })
  @ApiResponse({ description: 'List of articles', status: HttpStatus.OK, type: [Article] })
  @ApiResponse({ description: 'Error while getting articles', status: HttpStatus.BAD_REQUEST })
  @Get()
  findAll(@Query() { orderBy, skip, take, where }: FilterArticleDto): Promise<Article[]> {
    return this.articleService.findAll({ orderBy, skip, take, where });
  }

  @ApiOperation({ summary: 'Get article by ID' })
  @ApiParam({ description: 'Article ID', name: 'id', type: String })
  @ApiResponse({ description: 'Article found', status: HttpStatus.OK, type: Article })
  @ApiResponse({ description: 'Article not found', status: HttpStatus.NOT_FOUND })
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Article> {
    return this.articleService.findOne(+id);
  }

  @ApiOperation({ summary: 'Removing an article by ID' })
  @ApiParam({ description: 'Article ID to delete', name: 'id', type: String })
  @ApiResponse({ description: 'The article has been successfully removed', status: HttpStatus.OK })
  @ApiResponse({ description: 'Article not found', status: HttpStatus.NOT_FOUND })
  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.articleService.remove(+id);
  }

  @ApiBody({ type: UpdateArticleDto })
  @ApiOperation({ summary: 'Update article by ID' })
  @ApiParam({ description: 'Article ID to update', name: 'id', type: String })
  @ApiResponse({ description: 'The article has been successfully updated', status: HttpStatus.OK })
  @ApiResponse({ description: 'Error updating article', status: HttpStatus.BAD_REQUEST })
  @ApiResponse({ description: 'Article not found', status: HttpStatus.NOT_FOUND })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateArticleDto: UpdateArticleDto): Promise<Article> {
    return this.articleService.update(+id, updateArticleDto);
  }
}
