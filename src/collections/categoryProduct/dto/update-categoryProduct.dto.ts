import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';

export class UpdateCategoryProductDto {

  @ApiProperty()
  _id: string;

  @ApiProperty()
  realname: string;

  constructor(
    _id: string,
    realname: string,
  ) {
    this._id = _id;
    this.realname = realname;
  }
}