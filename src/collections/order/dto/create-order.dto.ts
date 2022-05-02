import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';

export class CreateOrderDto {

  @ApiProperty()
  productId: string;

  @ApiProperty()
  realname: string;

  @ApiProperty()
  mainImage: string;

  @ApiProperty({type:[{data:{type: String}, index:{type: Number}}]})
  slideImage: { data: string; index: number }[];

  @ApiProperty()
  type: string;

  @ApiProperty()
  category: string;

  @ApiProperty()
  cost: number;

  @ApiProperty()
  description: string;

  @ApiProperty()
  status: string;

  @ApiProperty({ type: [String] })
  include: string[];

  constructor(
    productId: string,
    realname: string,
    mainImage: string,
    slideImage: { data: string; index: number }[],
    type: string,
    category: string,
    cost: number,
    description: string,
    status: string,
    include: string[],
  ) {
    this.productId = productId;
    this.realname = realname;
    this.mainImage = mainImage;
    this.slideImage = slideImage;
    this.type = type;
    this.category = category;
    this.cost = cost;
    this.description = description;
    this.status = status;
    this.include = include;
  }
}