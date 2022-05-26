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
  @Prop({ required: true, unique: true })
  uid: string;

  @ApiProperty()
  @Prop()
  infomation: string;

  @ApiProperty()
  @Prop({ type: [String], default: ['New'] })
  status: string[];

  @ApiProperty()
  @Prop()
  phone: number;

  @ApiProperty()
  @Prop()
  account: string;

  @ApiProperty()
  @Prop()
  bank: string;

  @ApiProperty()
  @Prop({ type: [String] })
  include: string[];

  @ApiProperty()
  @Prop()
  imageUrl: string;

  @ApiProperty()
  @Prop()
  videoUrl: string;

  @ApiProperty()
  @Prop({
    type: [
      {
        dataUrl: { type: String },
        name: { type: String },
      },
    ]
  })
  certificates: { dataUrl: string, name: string }[];

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
  @Prop({ default: 0 })
  teachingMinutesMonth: number;

  @ApiProperty()
  @Prop({ default: 0 })
  totalTeachingMinutes: number;

  @ApiProperty()
  @Prop({ default: 5 })
  rating: number;

  @ApiProperty()
  @Prop({
    type: [
      {
        total: { type: Number },
        month: { type: Number },
        year: { type: Number },
      },
    ]
  })
  revenues?: { total: number, month: number, year: number }[];

  @ApiProperty()
  @Prop({ default: 0 })
  totalrevenue: number;

  @ApiProperty()
  @Prop({
    type: [
      {
        num: { type: Number },
        message: { type: String },
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
    uid: string,
    infomation: string,
    status: string[],
    phone: number,
    account: string,
    bank: string,
    include: string[],
    imageUrl: string,
    videoUrl: string,
    certificates: { dataUrl: string, name: string }[],
    questionone: string,
    questiontwo: string,
    numReviews: number,
    teachingMinutesMonth: number,
    totalTeachingMinutes: number,
    rating: number,
    revenues: { total: number, month: number, year: number }[],
    totalrevenue: number,
    warning: { num: number, message: string }[],
    reviews: { rating: number, comment: string, user: string }[],
    accept: boolean,
    createdAt: Date,
    updatedAt: Date) {
    super();
    this.user = user;
    this.uid = uid;
    this.infomation = infomation;
    this.status = status;
    this.phone = phone;
    this.account = account;
    this.bank = bank;
    this.include = include;
    this.imageUrl = imageUrl;
    this.videoUrl = videoUrl;
    this.certificates = certificates;
    this.questionone = questionone;
    this.questiontwo = questiontwo;
    this.numReviews = numReviews;
    this.teachingMinutesMonth = teachingMinutesMonth;
    this.totalTeachingMinutes = totalTeachingMinutes;
    this.rating = rating;
    this.revenues = revenues;
    this.totalrevenue = totalrevenue;
    this.warning = warning;
    this.reviews = reviews;
    this.accept = accept;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

export const TutorSchema = SchemaFactory.createForClass(Tutor);
