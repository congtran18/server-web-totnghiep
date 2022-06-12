import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { ApiProperty } from "@nestjs/swagger";

@Schema()
export class Message extends Document {

  @ApiProperty()
  @Prop({
    required: true,
    type: String,
  })
  from: string;

  @ApiProperty()
  @Prop({
    required: true,
    type: String,
  })
  to: string;

  @Prop({ required: true, type: String })
  text: string;

  @ApiProperty()
  @Prop({ default: false })
  read: boolean;

  @ApiProperty()
  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  constructor(from: string, to: string, text: string, read: boolean, createdAt: Date) {
    super();
    this.from = from;
    this.to = to;
    this.text = text;
    this.read = read;
    this.createdAt = createdAt;
  }
}

export const MessageSchema = SchemaFactory.createForClass(Message);
