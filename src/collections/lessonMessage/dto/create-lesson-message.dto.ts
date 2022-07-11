import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";

export class CreateLessonMessageDto {

  @IsNotEmpty()
  @ApiProperty()
  useruid?: string;

  @IsNotEmpty()
  @ApiProperty()
  tutoruid: string;

  @ApiProperty()
  start: Date;

  @ApiProperty()
  end: Date;

  @ApiProperty()
  type: string;

  constructor(useruid: string, tutoruid: string, start: Date, end: Date, type: string) {
    this.useruid = useruid;
    this.tutoruid = tutoruid;
    this.start = start;
    this.end = end;
    this.type = type;
  }
}
