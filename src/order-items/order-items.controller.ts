import { Controller, Post, Body, Get, Param, ParseIntPipe, Patch, Delete, UseGuards } from '@nestjs/common';
import { OrderItemsService } from './order-items.service';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/users/database/users.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('order-items')
export class OrderItemsController {
  constructor(
    private readonly orderItemsService: OrderItemsService,
  ) {}

  @Post(':orderId')
  @Roles(UserRole.ENCARGADO)
  async create(
    @Param('orderId', ParseIntPipe) orderId: number, 
    @Body() dto: CreateOrderItemDto
  ) {
    return this.orderItemsService.createByOrderId(orderId, dto);
  }

  @Get()
  @Roles(UserRole.ENCARGADO)
  async findAll() {
    return this.orderItemsService.findAll();
  }
  @Patch(':id')
  @Roles(UserRole.ENCARGADO)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateOrderItemDto
  ) {
    return this.orderItemsService.update(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.ENCARGADO)
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.orderItemsService.remove(id);
  }
}
