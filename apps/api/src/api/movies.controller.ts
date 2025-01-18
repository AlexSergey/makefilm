import { Controller, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';

import { FillDatabaseDto } from '../modules/movies/dtos/fill-database.dto';
import { Actor } from '../modules/movies/entities/actors.entity';
import { Director } from '../modules/movies/entities/directors.entity';
import { Genre } from '../modules/movies/entities/genres.entity';
import { Movie } from '../modules/movies/entities/movies.entity';
import { MoviesService } from '../modules/movies/movies.service';

@Controller('movies')
export class MoviesController {
  constructor(private readonly movieService: MoviesService) {}

  @Post('/fill-database')
  @UseInterceptors(FileInterceptor('file'))
  async fillDatabase(@UploadedFile() file: Express.Multer.File): Promise<void> {
    const fillDatabaseData: FillDatabaseDto[] = JSON.parse(file.buffer.toString());

    await this.movieService.createMovie(fillDatabaseData);
  }

  @Get('actors')
  async getActorsWithMovies(): Promise<Partial<Actor>[]> {
    return await this.movieService.getActorsWithMovies();
  }

  @Get()
  async getAllMovies(): Promise<Partial<Movie[]>> {
    return await this.movieService.getAllMovies();
  }

  @Get('directors')
  async getDirectorsWithMovies(): Promise<Partial<Director>[]> {
    return await this.movieService.getDirectorsWithMovies();
  }

  @Get('genres/actors')
  async getGenresWithActors(): Promise<Partial<Genre>[]> {
    return await this.movieService.getGenresWithActors();
  }

  @Get('genres/directors')
  async getGenresWithDirectors(): Promise<Partial<Genre>[]> {
    return await this.movieService.getGenresWithDirectors();
  }

  @Get('genres')
  async getGenresWithMovies(): Promise<Partial<Genre>[]> {
    return await this.movieService.getGenresWithMovies();
  }

  @Get(':id')
  async getMovieById(@Param('id') id: string): Promise<Partial<Movie>> {
    return await this.movieService.getMovieById(id);
  }
}
