import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from './database/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UsersService } from '../users/users.service';
import { ClientsService } from '../clients/clients.service';
import { OrderItemsService } from '../order-items/order-items.service';
import { UpdateOrderDto } from './dto/update-order.dto';
import { formatOrderResponse } from '../common/helpers/order.helper'; // 👈 Importaste tu helper


@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    private readonly usersService: UsersService,
    private readonly clientsService: ClientsService,
    private readonly orderItemsService: OrderItemsService,
  ) {}

  async createOrder(dto: CreateOrderDto) {
    const order = new Order();
    order.detail = dto.detail;
    order.status = dto.status ?? OrderStatus.PENDING;
    order.start_date = dto.start_date;
    order.end_date = dto.end_date;

    if (dto.assigned_to) {
      const user = await this.usersService.findById(dto.assigned_to);
      if (!user) throw new NotFoundException('Carpintero no encontrado');
      order.assigned_to = user;
    }

    if (dto.client) {
      const client = await this.clientsService.findById(dto.client);
      if (!client) throw new NotFoundException('Cliente no encontrado');
      order.client = client;
    }

    // Guardar la orden primero
    const savedOrder = await this.ordersRepository.save(order);

    // Crear los items asociados
    if (dto.items && dto.items.length) {
      for (const itemDto of dto.items) {
        await this.orderItemsService.create(savedOrder, itemDto);
      }
    }

    // Recargar la orden con total y items actualizados
    const updatedOrder = await this.ordersRepository.findOne({
      where: { id: savedOrder.id },
      relations: ['items', 'client', 'assigned_to'],
    });

    return formatOrderResponse(updatedOrder!); // 👈 usar helper
  }

  async findAll() {
    const orders = await this.ordersRepository.find({ relations: ['assigned_to', 'client', 'items'] });
    return orders.map(order => formatOrderResponse(order)); // 👈 usar helper
  }

  async findByCarpintero(userId: number) {
    const orders = await this.ordersRepository.find({
      where: { assigned_to: { id: userId } },
      relations: ['assigned_to', 'client', 'items'],
    });
    return orders.map(order => formatOrderResponse(order)); // 👈 usar helper
  }

  async findById(id: number) {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: ['assigned_to', 'client', 'items'],
    });
    if (!order) {
      throw new NotFoundException(`Orden con id ${id} no encontrada`);
    }
    return formatOrderResponse(order); // 👈 usar helper
  }

  async updateOrder(id: number, dto: UpdateOrderDto) {
    const order = await this.ordersRepository.findOne({ 
      where: { id }, 
      relations: ['assigned_to', 'client', 'items'] 
    });
    if (!order) throw new NotFoundException(`Orden con id ${id} no encontrada`);

    if (dto.assigned_to) {
      const user = await this.usersService.findById(dto.assigned_to);
      if (!user) throw new NotFoundException('Carpintero no encontrado');
      order.assigned_to = user;
    }

    if (dto.client) {
      const client = await this.clientsService.findById(dto.client);
      if (!client) throw new NotFoundException('Cliente no encontrado');
      order.client = client;
    }

    if (dto.detail !== undefined) order.detail = dto.detail;
    if (dto.status !== undefined) order.status = dto.status;
    if (dto.start_date !== undefined) order.start_date = dto.start_date;
    if (dto.end_date !== undefined) order.end_date = dto.end_date;

    const updated = await this.ordersRepository.save(order);
    return formatOrderResponse(updated); // 👈 usar helper
  }
  
  async remove(id: number): Promise<{ message: string }> {
    const order = await this.ordersRepository.findOne({ where: { id } });
    if (!order) {
      throw new NotFoundException(`Orden con id ${id} no encontrada`);
    }
    await this.ordersRepository.remove(order);
    return { message: `Orden ${id} eliminada correctamente` };
  }
}
