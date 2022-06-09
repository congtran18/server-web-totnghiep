import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { ApiProperty } from "@nestjs/swagger";

@Schema()
export class WarningTutor extends Document {

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

  @ApiProperty()
  @Prop({ required: true, type: String })
  videoUrl: string;

  @ApiProperty()
  @Prop({ required: true, type: String })
  comment: string;

  @ApiProperty()
  @Prop({ default: false })
  accept: boolean;

  @ApiProperty()
  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  constructor(from: string, to: string, videoUrl: string, comment: string, accept: boolean, createdAt: Date) {
    super();
    this.from = from;
    this.to = to;
    this.videoUrl = videoUrl;
    this.comment = comment;
    this.accept = accept;
    this.createdAt = createdAt;
  }
}

export const WarningTutorSchema = SchemaFactory.createForClass(WarningTutor);
