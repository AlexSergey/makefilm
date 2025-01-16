import { IsArray, IsNumber, IsString, IsUUID } from 'class-validator';

import { CreatorTypes } from '../entities/creator.entity';

export class FillDatabaseDto {
  @IsArray()
  actors: {
    id: string;
    name: string;
    type: CreatorTypes[];
  }[];

  @IsString()
  description: string;

  @IsArray()
  directors: {
    id: string;
    name: string;
    type: CreatorTypes[];
  }[];

  @IsArray()
  genres: {
    id: string;
    name: string;
  }[];

  @IsUUID()
  id: string;

  @IsString()
  thumbnail: string;

  @IsString()
  title: string;

  @IsNumber()
  year: number;
}
