import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

export enum LotStatus {
  Pending = 'pending',
  InProgress = 'inProcess',
  Closed = 'closed',
}

@Entity()
export class Lot {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  image: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: LotStatus.Pending })
  status: LotStatus;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'money' })
  currentPrice: number;

  @Column({ type: 'money' })
  estimatedPrice: number;

  @Column({ type: 'timestamp with time zone' })
  startTime: Date;

  @Column({ type: 'timestamp with time zone' })
  endTime: Date;

  @Column()
  userId: number;

  @ManyToOne(() => User)
  user: User;
}
