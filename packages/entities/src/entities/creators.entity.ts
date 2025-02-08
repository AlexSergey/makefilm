import { IsString, IsUUID } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum CreatorTypes {
  actor = 'actor',
  director = 'director',
}

@Entity()
export class Creator {
  @IsUUID()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @IsString()
  name: string;

  @Column({ array: true, enum: CreatorTypes, type: 'enum' })
  type: CreatorTypes[];
}
