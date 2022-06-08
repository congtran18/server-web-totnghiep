import { IsEmpty, IsNotEmpty } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";

export class CreateReviewTutorDto {

  @ApiProperty()
  @IsNotEmpty()
  to: string;

  @ApiProperty()
  @IsEmpty()
  from: string;

  @ApiProperty()
  @IsNotEmpty()
  rating: number;

  @ApiProperty()
  @IsEmpty()
  comment: string;

  constructor( to: string, from: string, rating: number, comment: string) {
    this.to = to;
    this.from = from;
    this.rating = rating;
    this.comment = comment;
  }
}
