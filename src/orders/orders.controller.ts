import { Controller, Post, Body, Get, Param, Patch, UseGuards, Req, Delete, ParseIntPipe } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../users/database/users.entity';
import { OrderStatus } from './database/order.entity';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post()
  @Roles(UserRole.ENCARGADO)
  create(@Body() dto: CreateOrderDto) {
    return this.ordersService.createOrder(dto);
  }

  @Get()
  @Roles(UserRole.ENCARGADO, UserRole.ADMIN, UserRole.CARPINTERO)
  findAll() {
    return this.ordersService.findAll();
  }

  @Get('my')
  @Roles(UserRole.CARPINTERO)
  findMyOrders(@Req() req) {
    return this.ordersService.findByCarpintero(req.user.sub); // sub = id del usuario en JWT
  }
  @Patch(':id')
  @Roles(UserRole.ENCARGADO)
  updateOrder(@Param('id') id: string, @Body() dto: UpdateOrderDto) {
    return this.ordersService.updateOrder(+id, dto);
  }
  
  @Delete(':id')
  @Roles(UserRole.ENCARGADO)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.remove(id);
  }
}

