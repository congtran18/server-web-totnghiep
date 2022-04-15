import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';
import mongoose from 'mongoose'

@Schema() 
export class CategoryProduct extends Document {

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
    update_at: Date
  ) {
    super();
    this.realname = realname;
    this.create_at= create_at;
    this.update_at = update_at;
  }
}

export const CategoryProductSchema = SchemaFactory.createForClass(CategoryProduct);
