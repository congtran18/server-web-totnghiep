import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';
import mongoose from 'mongoose'
import { CategoryProduct } from '../../categoryProduct/schemas/categoryProduct.schema';
import { Type } from 'class-transformer';

@Schema() 
export class TypeProduct extends Document {

  @ApiProperty()
  @Prop( { type: [mongoose.Schema.Types.ObjectId], ref: CategoryProduct.name })
  categoryProduct: CategoryProduct[];

  @ApiProperty()
  @Prop()
  realname: string;

  @ApiProperty()
  @Prop({ type: Date, default: Date.now })
  create_at: Date;

  @ApiProperty()
  @Prop({ type: Date, default: Date.now })
  update_at: Date;

  constructor(
    realname: string,
    create_at: Date,
    update_at: Date,
    categoryProduct: CategoryProduct[]
  ) {
    super();
    this.realname = realname;
    this.create_at= create_at;
    this.update_at = update_at;
    this.categoryProduct = categoryProduct;
  }
}

export const TypeProductSchema = SchemaFactory.createForClass(TypeProduct);
