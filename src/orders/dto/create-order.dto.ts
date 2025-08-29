import { IsNotEmpty, IsNumber, IsPositive, IsDateString, IsOptional, IsEnum, IsArray, ValidateNested } from 'class-validator';
import { OrderStatus } from '../database/order.entity';
import { Type } from 'class-transformer';
import { CreateOrderItemDto } from 'src/order-items/dto/create-order-item.dto';

export class CreateOrderDto {
  @IsNotEmpty()
  detail: string;

  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @IsDateString()
  start_date: string;

  @IsDateString()
  end_date: string;

  @IsOptional()
  assigned_to?: number; // ID del carpintero

  @IsOptional()
  client?: number; // ID del cliente
  
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
}
