import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('articles')
export class ArticleEntity {
  @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP(6)', type: 'timestamp' })
  createdAt: Date;

  @Column()
  description: string;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @UpdateDateColumn({ default: () => 'CURRENT_TIMESTAMP(6)', onUpdate: 'CURRENT_TIMESTAMP(6)', type: 'timestamp' })
  updatedAt: Date;
}
