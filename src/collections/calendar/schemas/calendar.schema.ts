import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from "@nestjs/swagger";

@Schema()
export class Calendar extends Document {
  @ApiProperty()
  @Prop({ required: true })
  user: string;

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
  notes: string;

  @ApiProperty()
  @Prop({ default: "#367CF7" })
  color: string;

  constructor(
    user: string,
    tutoruid: string,
    start: Date,
    end: Date,
    notes: string,
    color: string,
    ) {
    super();
    this.user = user;
    this.tutoruid = tutoruid;
    this.start = start;
    this.end = end;
    this.notes = notes;
    this.color = color;
  }
}

export const CalendarSchema = SchemaFactory.createForClass(Calendar);
