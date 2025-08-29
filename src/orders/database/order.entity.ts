import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../users/database/users.entity';
import { Client } from '../../clients/database/client.entity';
import { OrderItem } from '../../order-items/database/order-items.entity';

export enum OrderStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  detail: string; // descripción general del pedido

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  total: number; // suma de los items

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @CreateDateColumn()
  created_at: Date;

  @Column({ type: 'date', nullable: true })
  start_date: string;

  @Column({ type: 'date', nullable: true })
  end_date: string;

  @ManyToOne(() => User, { nullable: true, eager: true })
  assigned_to: User; // Carpintero asignado

  @ManyToOne(() => Client, { nullable: true, eager: true })
  client: Client; // Cliente

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
  items: OrderItem[];
}
