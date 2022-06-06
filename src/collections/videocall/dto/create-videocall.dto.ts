import { ApiProperty } from '@nestjs/swagger';

export class CreateVideocallDto {


  @ApiProperty()
  tutor?: string;

  @ApiProperty()
  user?: string;

  @ApiProperty()
  videoUrl?: string;

  constructor(
    tutor: string,
    user: string,
    videoUrl: string,
  ) {
    this.tutor = tutor;
    this.user = user;
    this.videoUrl = videoUrl;
  }
}