import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';
import mongoose from 'mongoose'
import { TypeProduct } from '../../typeProduct/schemas/typeProduct.schema';
import { CategoryProduct } from '../../categoryProduct/schemas/categoryProduct.schema';
import { Type } from 'class-transformer';

@Schema() 
export class Product extends Document {
  @ApiProperty()
  @Prop()
  productId: string;

  @ApiProperty()
  @Prop()
  code: string;

  @ApiProperty()
  @Prop()
  realname: string;

  @ApiProperty()
  @Prop({
    type:[{data:{type: String}, index:{type: Number}}]
  })
  image: { data: string; index: number }[];

  @ApiProperty()
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: TypeProduct.name })
  @Type(() => TypeProduct)
  type: string;

  @ApiProperty()
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: CategoryProduct.name })
  @Type(() => CategoryProduct)
  category: string;

  @ApiProperty()
  @Prop()
  cost: number;

  @ApiProperty()
  @Prop({ default: 0 })
  discount: number;

  @ApiProperty()
  @Prop()
  description: string;

  @ApiProperty()
  @Prop({ enum: ['Mới', 'Nổi bật', 'Bán chạy', 'Bình thường'], default: 'Mới' })
  status: string;

  @ApiProperty()
  @Prop({ type: [String] })
  include: string[];

  @ApiProperty()
  @Prop({ default: false })
  track: boolean;

  @ApiProperty()
  @Prop({ type: Date, default: Date.now })
  create_at: Date;

  @ApiProperty()
  @Prop({ type: Date, default: Date.now })
  update_at: Date;

  constructor(
    productId: string,
    code: string,
    realname: string,
    image: { data: string; index: number }[],
    type: string,
    category: string,
    cost: number,
    discount: number,
    description: string,
    status: string,
    include: string[],
    track: boolean,
    isFrozen: boolean,
    isMaster: boolean,
    create_at: Date,
    update_at: Date
  ) {
    super();
    this.productId = productId;
    this.code = code;
    this.realname = realname;
    this.image = image;
    this.type = type;
    this.category = category;
    this.cost = cost;
    this.discount = discount;
    this.description = description;
    this.status = status;
    this.include = include;
    this.track = track;
    this.create_at= create_at;
    this.update_at = update_at;
  }
}

export const ProductSchema = SchemaFactory.createForClass(Product);
