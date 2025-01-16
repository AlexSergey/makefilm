import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('articles')
export class ArticleEntity {
  @CreateDateColumn({ default: () => 'NOW()', type: 'timestamp' })
  createdAt: Date;

  @Column()
  description: string;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @UpdateDateColumn({ default: () => 'NOW()', onUpdate: 'NOW()', type: 'timestamp' })
  updatedAt: Date;
}
