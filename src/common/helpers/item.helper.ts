import { OrderItem } from '../../order-items/database/order-items.entity';

export function formatItemResponse(item: OrderItem) {
  return {
    id: item.id,
    quantity: item.quantity,
    unit_price: item.unit_price,
    total_price: item.total_price,
    orderId: item.order?.id,   // solo id de la orden
    productId: item.product?.id, // solo id del producto
  };
}

export function formatItemsResponse(items: OrderItem[]) {
  return items.map(formatItemResponse);
}
