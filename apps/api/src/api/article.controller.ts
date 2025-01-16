import {
  CreateArticleDto,
  CreateArticleResponseDto,
  GetArticleResponseDto,
  GetArticlesResponseDto,
  UpdateArticleDto,
} from '@makefilm/contracts';
import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, UseInterceptors } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

import { Filter, FilterParams } from '../common/database/decorators/filter.decorator';
import { Pagination, PaginationParams } from '../common/database/decorators/pagination.decorator';
import { SearchParams } from '../common/database/decorators/search.decorator';
import { Sorting, SortParams } from '../common/database/decorators/sort.decorator';
import { ResponseValidationInterceptor } from '../interceptors/response-validator.interceptor';
import { ArticleService } from '../modules/article/article.service';
import { Article } from '../modules/article/values/article.value';

@ApiTags('articles')
@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @ApiBody({ type: CreateArticleDto })
  @ApiOperation({ summary: 'Creating a new article' })
  @ApiResponse({ description: 'The article has been successfully created', status: HttpStatus.CREATED })
  @ApiResponse({ description: 'Error creating article', status: HttpStatus.BAD_REQUEST })
  @Post()
  @UseInterceptors(new ResponseValidationInterceptor(CreateArticleResponseDto))
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
  @UseInterceptors(new ResponseValidationInterceptor(GetArticlesResponseDto))
  findAll(
    @PaginationParams() pagination: Pagination,
    @SortParams() sort: Sorting,
    @SearchParams() search: null | string,
    @FilterParams() filter: Filter,
  ): Promise<{
    articles: Article[];
    total: number;
  }> {
    return this.articleService.findAll({ filter, pagination, search, sort });
  }

  @ApiOperation({ summary: 'Get article by ID' })
  @ApiParam({ description: 'Article ID', name: 'id', type: String })
  @ApiResponse({ description: 'Article found', status: HttpStatus.OK, type: Article })
  @ApiResponse({ description: 'Article not found', status: HttpStatus.NOT_FOUND })
  @Get(':id')
  @UseInterceptors(new ResponseValidationInterceptor(GetArticleResponseDto))
  findOne(@Param('id') id: string): Promise<Article> {
    return this.articleService.findOne(id);
  }

  @ApiOperation({ summary: 'Removing an article by ID' })
  @ApiParam({ description: 'Article ID to delete', name: 'id', type: String })
  @ApiResponse({ description: 'The article has been successfully removed', status: HttpStatus.OK })
  @ApiResponse({ description: 'Article not found', status: HttpStatus.NOT_FOUND })
  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.articleService.remove(id);
  }

  @ApiBody({ type: UpdateArticleDto })
  @ApiOperation({ summary: 'Update article by ID' })
  @ApiParam({ description: 'Article ID to update', name: 'id', type: String })
  @ApiResponse({ description: 'The article has been successfully updated', status: HttpStatus.OK })
  @ApiResponse({ description: 'Error updating article', status: HttpStatus.BAD_REQUEST })
  @ApiResponse({ description: 'Article not found', status: HttpStatus.NOT_FOUND })
  @Patch(':id')
  @UseInterceptors(new ResponseValidationInterceptor(GetArticleResponseDto))
  update(@Param('id') id: string, @Body() updateArticleDto: UpdateArticleDto): Promise<Article> {
    return this.articleService.update(id, updateArticleDto);
  }
}
