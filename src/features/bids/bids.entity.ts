import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Lot } from '../lots/lot.entity';
import { User } from '../users/user.entity';

@Entity()
@Unique(['lotId', 'userId'])
export class Bid {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer' })
  price: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  lotId: number;

  @Column()
  userId: number;

  @ManyToOne(() => Lot)
  lot: Lot;

  @ManyToOne(() => User)
  user: User;
}
