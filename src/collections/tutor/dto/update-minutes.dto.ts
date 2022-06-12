import {IsNotEmpty} from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";

export class UpdateTutorMinutesDto {

  @IsNotEmpty()
  @ApiProperty()
  value: string;

  constructor(value: string) {
    this.value = value;
  }
}
