import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";

export class CreateCalendarDto {

  @IsNotEmpty()
  @ApiProperty()
  user: string;

  @IsNotEmpty()
  @ApiProperty()
  tutoruid: string;

  @ApiProperty()
  start: Date;

  @ApiProperty()
  end: Date;

  @ApiProperty()
  notes: string;

  constructor(user: string, tutoruid: string, start: Date, end: Date, notes: string) {
    this.user = user;
    this.tutoruid = tutoruid;
    this.start = start;
    this.end = end;
    this.notes = notes;
  }
}
