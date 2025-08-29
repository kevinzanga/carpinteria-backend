import { Order } from '../../orders/database/order.entity';

export function formatOrderResponse(order: Order) {
  return {
    id: order.id,
      detail: order.detail,
      total: order.total,
      status: order.status,
      created_at: order.created_at,
      start_date: order.start_date,
      end_date: order.end_date,
      assigned_to: order.assigned_to ? { id: order.assigned_to.id, name: order.assigned_to.name } : undefined,
      client: order.client ? { id: order.client.id, name: order.client.name } : undefined,
      items: order.items ? order.items.map(item => ({ id: item.id, idp: item.product.id ,name: item.product.name, quantity: item.quantity})) : [],
  };
}
