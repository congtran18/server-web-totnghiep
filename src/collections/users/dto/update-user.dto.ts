import {ApiProperty} from "@nestjs/swagger";

export class UpdateUserDto {

  @ApiProperty()
  username?: string;

  @ApiProperty()
  password?: string;

  @ApiProperty()
  fullName?: string;

  @ApiProperty()
  imageUrl?: string;

  constructor(username: string, password: string, fullName: string, imageUrl: string) {
    this.username = username;
    this.password = password;
    this.fullName = fullName;
    this.imageUrl = imageUrl;
  }
}
