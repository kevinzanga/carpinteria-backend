import { Client } from '../../clients/database/client.entity';

export function formatClientResponse(client: Client) {
  return {
    id: client.id,
    name: client.name,
    phone: client.phone,
    email: client.email,
    orders: client.orders ? client.orders.map(order => ({ id: order.id })) : [],
  };
}

export function formatClientsResponse(clients: Client[]) {
  return clients.map(formatClientResponse);
}
