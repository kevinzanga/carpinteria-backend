import { IsNumber, IsPositive } from 'class-validator';

export class CreateOrderItemDto {

  @IsNumber()
  product_id: number;

  @IsNumber()
  @IsPositive()
  quantity: number;
}
