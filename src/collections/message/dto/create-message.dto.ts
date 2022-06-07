import { IsEmpty, IsNotEmpty } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";

export class CreateMessageDto {

  @ApiProperty()
  @IsNotEmpty()
  to: string;

  @ApiProperty()
  @IsEmpty()
  from: string;

  @ApiProperty()
  @IsNotEmpty()
  text: string;

  constructor( to: string, from: string, text: string) {
    this.to = to;
    this.from = from;
    this.text = text;
  }
}
