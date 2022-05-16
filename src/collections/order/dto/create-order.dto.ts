import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';

export class CreateOrderDto {


  @ApiProperty()
  orderItems: { qty: number, productId?: mongoose.Schema.Types.ObjectId, subtotal: number, unit_price: number, ticket_id?:any }[];

  @ApiProperty()
  user?: string;

  @ApiProperty()
  totalPrice: number;

  @ApiProperty()
  status: string;

  @ApiProperty()
  paymentMethod?: string;


  @ApiProperty()
  shippingPrice?: number;

  @ApiProperty()
  isDelivered?: boolean;


  constructor(
    orderItems: { qty: number, productId?: mongoose.Schema.Types.ObjectId, subtotal: number, unit_price: number, ticket_id?:any }[],
    totalPrice: number,
    status: string,
    user?: string,
    paymentMethod?: string,
    shippingPrice?: number,
    isDelivered?: boolean,
  ) {
    this.orderItems = orderItems;
    this.user = user;
    this.totalPrice = totalPrice;
    this.status = status;
    this.paymentMethod = paymentMethod;
    this.shippingPrice = shippingPrice;
    this.isDelivered = isDelivered;
  }
}