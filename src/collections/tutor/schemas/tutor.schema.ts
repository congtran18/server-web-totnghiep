import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from "@nestjs/swagger";
import { User } from '../../users/schemas/user.schema';
import mongoose from 'mongoose'

@Schema()
export class Tutor extends Document {
  @ApiProperty()
  @Prop({ required: true, unique: true })
  user: string;

  @ApiProperty()
  @Prop()
  infomation: string;

  @ApiProperty()
  @Prop({ default: 'Mới gia nhập' })
  type: string;

  @ApiProperty()
  @Prop()
  phone: number;

  @ApiProperty()
  @Prop({ type: [String] })
  include: string[];

  @ApiProperty()
  @Prop()
  video: string;

  @ApiProperty()
  @Prop({ type: [String] })
  certificates: string[];

  @ApiProperty()
  @Prop()
  questionone: string;

  @ApiProperty()
  @Prop()
  questiontwo: string;

  @ApiProperty()
  @Prop({ default: 0 })
  numReviews: number;

  @ApiProperty()
  @Prop({ default: 5 })
  rating: number;

  @ApiProperty()
  @Prop({
    type: [
      {
        num: { type: Number },
        message: { type: String},
      },
      {
        timestamps: true,
      }
    ]
  })
  warning?: { num: number, message: string }[];

  @ApiProperty()
  @Prop({
    type: [
      {
        rating: { type: Number, required: true },
        comment: { type: String, required: true },
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: User.name,
        },
      },
      {
        timestamps: true,
      }
    ]
  })
  reviews?: { rating: number, comment: string, user: string }[];

  @ApiProperty()
  @Prop({ default: false })
  accept: boolean;

  @ApiProperty()
  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @ApiProperty()
  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;

  constructor(
    user: string,
    infomation: string,
    type: string,
    phone: number,
    include: string[],
    video: string,
    certificates: string[],
    questionone: string,
    questiontwo: string,
    numReviews: number,
    rating: number,
    warning: { num: number, message: string }[],
    reviews: { rating: number, comment: string, user: string }[],
    accept: boolean,
    createdAt: Date,
    updatedAt: Date) {
    super();
    this.user = user;
    this.infomation = infomation;
    this.type = type;
    this.phone = phone;
    this.include = include;
    this.video = video;
    this.certificates = certificates;
    this.questionone = questionone;
    this.questiontwo = questiontwo;
    this.numReviews = numReviews;
    this.rating = rating;
    this.warning = warning;
    this.reviews = reviews;
    this.accept = accept;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

export const TutorSchema = SchemaFactory.createForClass(Tutor);
