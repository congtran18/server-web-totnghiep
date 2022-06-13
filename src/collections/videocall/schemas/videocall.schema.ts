import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';
import mongoose from 'mongoose'

@Schema()
export class Videocall extends Document {

  @ApiProperty()
  @Prop()
  tutor?: string;

  @ApiProperty()
  @Prop()
  user?: string;

  @ApiProperty()
  @Prop()
  videoUrl?: string;

  @ApiProperty()
  @Prop({
    type:
    {
      read: String,
      vocabulary: String,
      listen: String,
      comment: String,
    }

  })
  comment?: { read: String, vocabulary: String, listen: String, comment: String };

  @ApiProperty()
  @Prop({ type: Date, default: Date.now })
  create_at: Date;

  @ApiProperty()
  @Prop({ type: Date, default: Date.now })
  update_at: Date;

  constructor(
    tutor: string,
    user: string,
    videoUrl: string,
    comment: { read: String, vocabulary: String, listen: String, comment: String },
    create_at: Date,
    update_at: Date,
  ) {
    super();
    this.tutor = tutor;
    this.user = user;
    this.videoUrl = videoUrl;
    this.comment = comment;
    this.create_at = create_at;
    this.update_at = update_at;
  }
}

export const VideocallSchema = SchemaFactory.createForClass(Videocall);
