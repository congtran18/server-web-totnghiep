import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from "@nestjs/swagger";

@Schema()
export class Calendar extends Document {
  @ApiProperty()
  @Prop({ required: true, unique: true })
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

  constructor(
    user: string,
    tutoruid: string,
    start: Date,
    end: Date,
    notes: string,
    ) {
    super();
    this.user = user;
    this.tutoruid = tutoruid;
    this.start = start;
    this.end = end;
    this.notes = notes;
  }
}

export const CalendarSchema = SchemaFactory.createForClass(Calendar);
