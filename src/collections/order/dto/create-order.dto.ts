import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';

export class CreateOrderDto {


  @ApiProperty()
  orderItems?: { qty: number, productId: string, productName: string, subtotal: number, unit_price: number }[];

  @ApiProperty()
  address?: { city?: string, country?: string, address?: string, postal_code?: string, state?: string };

  @ApiProperty()
  user?: string;

  @ApiProperty()
  typeCourse?: string;

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
    orderItems: { qty: number, productId: string, productName: string, subtotal: number, unit_price: number }[],
    address: { city: string, country: string, address: string, postal_code: string, state: string },
    totalPrice: number,
    status: string,
    user: string,
    typeCourse: string,
    paymentMethod: string,
    shippingPrice: number,
    isDelivered: boolean,
  ) {
    this.orderItems = orderItems;
    this.address = address;
    this.user = user;
    this.totalPrice = totalPrice;
    this.status = status;
    this.typeCourse = typeCourse;
    this.paymentMethod = paymentMethod;
    this.shippingPrice = shippingPrice;
    this.isDelivered = isDelivered;
  }
}