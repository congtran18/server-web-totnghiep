import { ApiProperty } from '@nestjs/swagger';

export class UpdateTypeProductDto {

  @ApiProperty()
  _id: string;

  @ApiProperty({ type: [String] })
  categoryProduct: string[];

  @ApiProperty()
  realname: string;

  constructor(
    _id: string,
    categoryProduct: string[],
    realname: string,
  ) {
    this._id = _id;
    this.categoryProduct = categoryProduct;
    this.realname = realname;
  }
}