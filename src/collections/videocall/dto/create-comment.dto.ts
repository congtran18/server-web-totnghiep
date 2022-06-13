import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {


  @ApiProperty()
  read?: string;

  @ApiProperty()
  vocabulary?: string;

  @ApiProperty()
  listen?: string;

  @ApiProperty()
  comment?: string;

  constructor(
    read: string,
    vocabulary: string,
    listen: string,
    comment: string,
  ) {
    this.read = read;
    this.vocabulary = vocabulary;
    this.listen = listen;
    this.comment = comment;
  }
}