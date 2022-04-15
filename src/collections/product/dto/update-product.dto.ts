import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';

export class UpdateProducttDto {

  @ApiProperty()
  _id: string;

  @ApiProperty()
  productId: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  image: { data: string; index: number }[];

  @ApiProperty()
  type: mongoose.Schema.Types.ObjectId;

  @ApiProperty()
  category: mongoose.Schema.Types.ObjectId;

  @ApiProperty()
  cost: number;

  @ApiProperty()
  discount: number;

  @ApiProperty()
  description: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  include: string[];

  constructor(
    _id: string,
    productId: string,
    name: string,
    image: { data: string; index: number }[],
    type: mongoose.Schema.Types.ObjectId,
    category: mongoose.Schema.Types.ObjectId,
    cost: number,
    discount: number,
    description: string,
    status: string,
    include: string[],
  ) {
    this._id = _id;
    this.productId = productId;
    this.name = name;
    this.image = image;
    this.type = type;
    this.category = category;
    this.cost = cost;
    this.discount = discount;
    this.description = description;
    this.status = status;
    this.include = include;
  }
}