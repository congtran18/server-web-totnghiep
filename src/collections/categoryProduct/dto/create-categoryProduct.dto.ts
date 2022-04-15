import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryProductDto {

  @ApiProperty()
  realname: string;

  constructor(
    realname: string,
  ) {
    this.realname = realname;
  }
}