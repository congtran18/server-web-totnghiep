import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { ApiProperty } from "@nestjs/swagger";

@Schema()
export class ReviewTutor extends Document {

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

  @Prop({ required: true, type: Number })
  rating: number;

  @Prop({ required: true, type: String })
  comment: string;

  @ApiProperty()
  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  constructor(from: string, to: string, rating: number, comment: string, createdAt: Date) {
    super();
    this.from = from;
    this.to = to;
    this.rating = rating;
    this.comment = comment;
    this.createdAt = createdAt;
  }
}

export const ReviewTutorSchema = SchemaFactory.createForClass(ReviewTutor);
