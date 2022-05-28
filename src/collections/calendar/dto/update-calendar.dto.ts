import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";

export class UpdateCalendarDto {

  @ApiProperty()
  start: Date;

  @ApiProperty()
  end: Date;

  @ApiProperty()
  notes: string;

  constructor( start: Date, end: Date, notes: string) {
    this.start = start;
    this.end = end;
    this.notes = notes;
  }
}
