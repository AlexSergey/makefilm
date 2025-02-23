import { StatusEnum, UserRolesEnum } from '@makefilm/contracts';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

// import { PostsEntity } from '../../posts/post.entity';
import { SessionsEntity } from './sessions.entity';

@Entity('users')
export class UsersEntity {
  @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP(6)', type: 'timestamp' })
  createdAt: Date;

  @Column({ unique: true })
  email: string;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  password?: string;

  /*  @OneToMany(() => PostsEntity, (post) => post.user, { onDelete: 'CASCADE' })
  posts?: PostsEntity[];*/

  @Column({ default: UserRolesEnum.NotConfirmed, enum: UserRolesEnum, type: 'enum' })
  role: UserRolesEnum;

  @OneToMany(() => SessionsEntity, (session) => session.user, { onDelete: 'CASCADE' })
  sessions: SessionsEntity[];

  @Column({ default: StatusEnum.Active, enum: StatusEnum, type: 'enum' })
  status: StatusEnum;

  @UpdateDateColumn({ default: () => 'CURRENT_TIMESTAMP(6)', onUpdate: 'CURRENT_TIMESTAMP(6)', type: 'timestamp' })
  updatedAt: Date;

  @Column()
  username: string;
}
