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
  @Prop()
  realname: string;

  @ApiProperty()
  @Prop()
  mobile: string;

  @ApiProperty()
  @Prop({
    type: [
      {
        realname: { type: String },
        qty: { type: Number, required: true },
        cost: { type: Number },
        code: { type: String },
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: Product.name,
        },
      }
    ]
  })
  orderItems: { realname: string; qty: number, cost: number, code: string, _id: mongoose.Schema.Types.ObjectId }[];

  @ApiProperty()
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  @Type(() => User)
  user: string;

  @ApiProperty()
  @Prop()
  totalPrice: number;


  @ApiProperty()
  @Prop()
  description: string;

  @ApiProperty()
  @Prop({ enum: ['Hoàn thành', 'Chưa thanh toán', 'Đã hủy'], default: 'Chưa thanh toán' })
  status: string;

  @ApiProperty()
  @Prop({ default: 'Khi nhận hàng' })
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
    realname: string,
    mobile: string,
    orderItems: { realname: string; qty: number, cost: number, code: string, _id: mongoose.Schema.Types.ObjectId }[],
    user: string,
    totalPrice: number,
    description: string,
    status: string,
    paymentMethod: string,
    track: boolean,
    shippingPrice: number,
    isDelivered: boolean,
    create_at: Date,
    update_at: Date
  ) {
    super();
    this.realname = realname;
    this.mobile = mobile;
    this.orderItems = orderItems;
    this.user = user;
    this.totalPrice = totalPrice;
    this.description = description;
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
