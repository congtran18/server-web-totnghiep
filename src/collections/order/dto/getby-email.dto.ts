import {IsNotEmpty} from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";
import { IsEmail } from 'class-validator';

export class GetOrderDto {

  @IsNotEmpty()
  @ApiProperty()
  @IsEmail()
  email: string;

  constructor(email: string) {
    this.email = email;
  }
}
