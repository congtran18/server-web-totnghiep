import {IsNotEmpty} from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";
import { IsEmail } from 'class-validator';

export class CreateUserDto {

  @IsNotEmpty()
  @ApiProperty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @ApiProperty()
  password: string;

  @ApiProperty()
  minutes?: number;

  @ApiProperty()
  daysleft?: number;

  @ApiProperty()
  fullName?: string;

  @ApiProperty()
  imageUrl?: string;

  constructor(email: string, password: string, minutes: number, daysleft: number, fullName: string, imageUrl: string) {
    this.email = email;
    this.password = password;
    this.minutes = minutes;
    this.daysleft = daysleft;
    this.fullName = fullName;
    this.imageUrl = imageUrl;
  }
}
