import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order } from './database/order.entity';
import { UsersModule } from '../users/users.module';
import { ClientsModule } from '../clients/clients.module';
import { OrderItemsModule } from '../order-items/order-items.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    UsersModule,
    ClientsModule,
    OrderItemsModule, // <--- import aquí
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
