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
  fullName?: string;

  @ApiProperty()
  imageUrl?: string;

  constructor(email: string, password: string, fullName: string, imageUrl: string) {
    this.email = email;
    this.password = password;
    this.fullName = fullName;
    this.imageUrl = imageUrl;
  }
}
