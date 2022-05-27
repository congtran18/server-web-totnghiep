import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";

export class UpdateCalendarDto {

  @IsNotEmpty()
  @ApiProperty()
  user: string;

  @IsNotEmpty()
  @ApiProperty()
  uid: string;

  @ApiProperty()
  start: Date;

  @ApiProperty()
  end: Date;

  @ApiProperty()
  notes: string;

  constructor(user: string, uid: string, start: Date, end: Date, notes: string) {
    this.user = user;
    this.uid = uid;
    this.start = start;
    this.end = end;
    this.notes = notes;
  }
}
