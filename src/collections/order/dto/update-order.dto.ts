import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';

export class UpdateOrderDto {

  @ApiProperty()
  status?: string;

  @ApiProperty()
  isDelivered?: boolean;

  constructor(
    status: string,
    isDelivered: boolean,
  ) {
    this.status = status;
    this.isDelivered = isDelivered;
  }
}