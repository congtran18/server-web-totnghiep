import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";

export class UpdateCalendarDto {

  @ApiProperty()
  tutoruid: string;

  @ApiProperty()
  start: Date;

  @ApiProperty()
  end: Date;

  @ApiProperty()
  notes: string;

  constructor( tutoruid: string, start: Date, end: Date, notes: string) {
    this.tutoruid = tutoruid;
    this.start = start;
    this.end = end;
    this.notes = notes;
  }
}
