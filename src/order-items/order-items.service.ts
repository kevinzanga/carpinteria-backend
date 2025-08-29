import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderItem } from './database/order-items.entity';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { Order } from '../orders/database/order.entity';
import { Product } from '../products/database/product.entity';
import { formatItemResponse, formatItemsResponse } from '../common/helpers/item.helper';
import { formatOrderResponse } from '../common/helpers/order.helper';

@Injectable()
export class OrderItemsService {
  constructor(
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,

    @InjectRepository(Product)
    private productRepository: Repository<Product>,

    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  async create(order: Order, dto: CreateOrderItemDto): Promise<any> {
    const product = await this.productRepository.findOne({ where: { id: dto.product_id } });
    if (!product) throw new NotFoundException('Producto no encontrado');

    const total_price = Number(product.price) * dto.quantity;

    const orderItem = this.orderItemRepository.create({
      order,
      product,
      quantity: dto.quantity,
      unit_price: product.price,
      total_price,
    });

    await this.orderItemRepository.save(orderItem);

    // Recalcular y devolver la orden completa formateada
    return this.updateOrderTotal(order.id);
  }

  async createByOrderId(orderId: number, dto: CreateOrderItemDto): Promise<any> {
    const order = await this.orderRepository.findOne({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Orden no encontrada');
    return this.create(order, dto);
  }

  async findAll(): Promise<any[]> {
    const items = await this.orderItemRepository.find({ relations: ['order', 'product'] });
    return formatItemsResponse(items);
  }

  async update(id: number, dto: CreateOrderItemDto): Promise<any> {
    const orderItem = await this.orderItemRepository.findOne({ where: { id }, relations: ['product', 'order'] });
    if (!orderItem) throw new NotFoundException('Item no encontrado');

    const product = await this.productRepository.findOne({ where: { id: dto.product_id } });
    if (!product) throw new NotFoundException('Producto no encontrado');

    orderItem.product = product;
    orderItem.quantity = dto.quantity;
    orderItem.unit_price = product.price;
    orderItem.total_price = Number(product.price) * dto.quantity;

    await this.orderItemRepository.save(orderItem);

    return this.updateOrderTotal(orderItem.order.id);
  }

  async remove(id: number): Promise<any> {
    const orderItem = await this.orderItemRepository.findOne({ where: { id }, relations: ['order'] });
    if (!orderItem) throw new NotFoundException('Item no encontrado');

    const orderId = orderItem.order.id;
    await this.orderItemRepository.remove(orderItem);

    return this.updateOrderTotal(orderId);
  }

  /**
   * 🔑 Recalcula el total de la orden y devuelve la orden completa con items formateados
   */
  private async updateOrderTotal(orderId: number): Promise<any> {
    const items = await this.orderItemRepository.find({ 
      where: { order: { id: orderId } }, 
      relations: ['product'] 
    });

    const total = items.reduce((sum, item) => sum + Number(item.total_price), 0);

    const orderToUpdate = await this.orderRepository.findOne({ 
      where: { id: orderId },
      relations: ['items', 'client', 'assigned_to'],
    });

    if (!orderToUpdate) {
      throw new NotFoundException(`Orden con id ${orderId} no encontrada al actualizar total`);
    }

    orderToUpdate.total = total;
    orderToUpdate.items = items;

    await this.orderRepository.save(orderToUpdate);

    return {
      items: formatItemsResponse(items),
    };
  }
}
