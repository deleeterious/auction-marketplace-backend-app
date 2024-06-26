import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Bid } from '../bids/bids.entity';
import { Order } from '../orders/order.entity';

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

  @OneToMany(() => Bid, (bid) => bid.lot)
  bids: Bid[];

  @OneToOne(() => Order, (order) => order.lot)
  order: Order;

  @OneToOne(() => Bid, { nullable: true })
  @JoinColumn()
  winningBid?: Bid;
}
