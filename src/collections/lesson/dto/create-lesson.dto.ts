import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";

export class CreateLessonDto {

  @IsNotEmpty()
  @ApiProperty()
  user: string;

  @IsNotEmpty()
  @ApiProperty()
  username: string;

  @IsNotEmpty()
  @ApiProperty()
  tutoruid: string;

  @ApiProperty()
  start: Date;

  @ApiProperty()
  end: Date;

  @ApiProperty()
  notes: string;

  constructor(user: string, username: string, tutoruid: string, start: Date, end: Date, notes: string) {
    this.user = user;
    this.username = username;
    this.tutoruid = tutoruid;
    this.start = start;
    this.end = end;
    this.notes = notes;
  }
}
