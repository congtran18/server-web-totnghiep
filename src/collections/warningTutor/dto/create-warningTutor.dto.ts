import { IsEmpty, IsNotEmpty } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";

export class CreateWarningTutorDto {

  @ApiProperty()
  @IsNotEmpty()
  to: string;

  @ApiProperty()
  @IsEmpty()
  from: string;

  @ApiProperty()
  @IsNotEmpty()
  videoUrl: string;

  @ApiProperty()
  @IsNotEmpty()
  comment: string;

  constructor( to: string, from: string, videoUrl: string, comment: string) {
    this.to = to;
    this.from = from;
    this.videoUrl = videoUrl;
    this.comment = comment;
  }
}
