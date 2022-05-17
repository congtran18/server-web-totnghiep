import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';
import mongoose from 'mongoose'
import { User } from '../../users/schemas/user.schema';
import { Product } from '../../product/schemas/product.schema';
import { Type } from 'class-transformer';

@Schema()
export class Order extends Document {

  @ApiProperty()
  @Prop({
    type: [
      {
        qty: { type: Number, required: true },
        ProductId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: Product.name,
        },
        subtotal: Number, unit_price: Number, ticket_id: String
      }
    ]
  })
  orderItems: { qty: number, productId?: string, subtotal: number, unit_price: number, ticket_id?: any }[];

  @ApiProperty()
  @Prop({
    type: [
      {
        city: { type: String },
        country: { type: String },
        address: { type: String },
        postal_code: { type: String },
        state: { type: String }
      }
    ]
  })
  address: { city?: string, country?: string, address?: string, postal_code?: string, state?: string };

  // @ApiProperty()
  // @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  // @Type(() => User)
  // user: string;

  @ApiProperty()
  @Prop()
  user: string;

  @ApiProperty()
  @Prop()
  totalPrice: number;

  @ApiProperty()
  @Prop({ enum: ['Hoàn thành', 'Chưa thanh toán', 'Đã hủy'], default: 'Hoàn thành' })
  status: string;

  @ApiProperty()
  @Prop({ default: 'Stripe' })
  paymentMethod: string;

  @ApiProperty()
  @Prop({ default: false })
  track: boolean;

  @ApiProperty()
  @Prop({ default: 0 })
  shippingPrice: number;

  @ApiProperty()
  @Prop({ default: false })
  isDelivered: boolean;

  @ApiProperty()
  @Prop({ type: Date, default: Date.now })
  create_at: Date;

  @ApiProperty()
  @Prop({ type: Date, default: Date.now })
  update_at: Date;

  constructor(
    orderItems: { qty: number, productId?: string, subtotal: number, unit_price: number, ticket_id?: any }[],
    address: {city: string, country: string, address: string, postal_code: string, state: string},
    user: string,
    totalPrice: number,
    status: string,
    paymentMethod: string,
    track: boolean,
    shippingPrice: number,
    isDelivered: boolean,
    create_at: Date,
    update_at: Date
  ) {
    super();
    this.orderItems = orderItems;
    this.address = address;
    this.user = user;
    this.totalPrice = totalPrice;
    this.status = status;
    this.paymentMethod = paymentMethod;
    this.track = track;
    this.shippingPrice = shippingPrice;
    this.isDelivered = isDelivered;
    this.create_at = create_at;
    this.update_at = update_at;
  }
}

export const OrderSchema = SchemaFactory.createForClass(Order);
