import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderItemsService } from './order-items.service';
import { OrderItemsController } from './order-items.controller';
import { OrderItem } from './database/order-items.entity';
import { Product } from '../products/database/product.entity';
import { Order } from '../orders/database/order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrderItem, Product, Order])],
  controllers: [OrderItemsController],
  providers: [OrderItemsService],
  exports: [OrderItemsService], // exporta para otros módulos
})
export class OrderItemsModule {}
