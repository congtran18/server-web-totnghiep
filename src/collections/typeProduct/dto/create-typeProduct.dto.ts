import { ApiProperty } from '@nestjs/swagger';

export class CreateTypeProductDto {

  @ApiProperty({ type: [String] })
  categoryProduct: string[];

  @ApiProperty()
  realname: string;


  constructor(
    categoryProduct: string[],
    realname: string,
  ) {
    this.categoryProduct = categoryProduct;
    this.realname = realname;
  }
}