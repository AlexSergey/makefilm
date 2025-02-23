import { AuthProviderEnum, StatusEnum } from '@makefilm/contracts';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { UsersEntity } from './users.entity';

@Entity('sessions')
export class SessionsEntity {
  @Column({ default: AuthProviderEnum.Local, enum: AuthProviderEnum, type: 'enum' })
  authProvider: AuthProviderEnum;

  @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP(6)', type: 'timestamp' })
  createdAt: Date;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  ip: string;

  @Column({ type: 'real' })
  lat: string;

  @Column({ type: 'real' })
  lng: string;

  @Column({ default: StatusEnum.Active, enum: StatusEnum, type: 'enum' })
  status: StatusEnum;

  @Column()
  token: string;

  @UpdateDateColumn({ default: () => 'CURRENT_TIMESTAMP(6)', onUpdate: 'CURRENT_TIMESTAMP(6)', type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => UsersEntity, (user) => user.sessions, { onDelete: 'CASCADE' })
  user: UsersEntity;

  @Column()
  userAgent: string;
}
