import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";

export class GetLessonDto {

  @ApiProperty()
  start: Date;

  @ApiProperty()
  end: Date;

  constructor(start: Date, end: Date) {
    this.start = start;
    this.end = end;
  }
}
