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

  @Prop({ required: true, type: String })
  videoUrl: string;

  @Prop({ required: true, type: String })
  comment: string;

  @ApiProperty()
  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  constructor(from: string, to: string, videoUrl: string, comment: string, createdAt: Date) {
    super();
    this.from = from;
    this.to = to;
    this.videoUrl = videoUrl;
    this.comment = comment;
    this.createdAt = createdAt;
  }
}

export const WarningTutorSchema = SchemaFactory.createForClass(WarningTutor);
