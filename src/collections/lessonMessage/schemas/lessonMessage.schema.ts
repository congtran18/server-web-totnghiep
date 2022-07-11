import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from "@nestjs/swagger";

@Schema()
export class LessonMessage extends Document {
  @ApiProperty()
  @Prop({ required: true })
  useruid: string;

  @ApiProperty()
  @Prop({ required: true })
  tutoruid: string;

  @ApiProperty()
  @Prop({ type: Date, required: true })
  start: Date;

  @ApiProperty()
  @Prop({ type: Date, required: true })
  end: Date;

  @ApiProperty()
  @Prop()
  type: string;

  @ApiProperty()
  @Prop({ default: false })
  read: boolean;

  constructor(
    useruid: string,
    tutoruid: string,
    start: Date,
    end: Date,
    type: string,
    read: boolean
  ) {
    super();
    this.useruid = useruid;
    this.tutoruid = tutoruid;
    this.start = start;
    this.end = end;
    this.type = type;
    this.read = read;
  }
}

export const LessonMessageSchema = SchemaFactory.createForClass(LessonMessage);
