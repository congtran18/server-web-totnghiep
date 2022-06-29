import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";

export class CreateLessonDto {

  @IsNotEmpty()
  @ApiProperty()
  user: string;

  @IsNotEmpty()
  @ApiProperty()
  tutor: string;

  @ApiProperty()
  start: Date;

  @ApiProperty()
  end: Date;

  @ApiProperty()
  notes: string;

  constructor(user: string, tutor: string, start: Date, end: Date, notes: string) {
    this.user = user;
    this.tutor = tutor;
    this.start = start;
    this.end = end;
    this.notes = notes;
  }
}
