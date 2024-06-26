import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Bid } from '../bids/bids.entity';
import { Lot } from '../lots/lot.entity';

export enum OrderStatus {
  Pending = 'pending',
  Sent = 'sent',
  Delivered = 'delivered',
}

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  arrivalLocation: string;

  @Column()
  arrivalType: string;

  @Column({ default: OrderStatus.Pending })
  status: OrderStatus;

  @Column()
  lotId: number;

  @Column()
  bidId: number;

  @OneToOne(() => Lot, (lot) => lot.order)
  @JoinColumn()
  lot: Lot;

  @OneToOne(() => Bid)
  @JoinColumn()
  bid: Bid;
}
