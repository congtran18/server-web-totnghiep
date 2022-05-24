import {IsNotEmpty} from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";

export class CreateTutorDto {

  @IsNotEmpty()
  @ApiProperty()
  user: string;

  @ApiProperty()
  infomation: string;

  @ApiProperty()
  phone: number;

  @ApiProperty()
  include: string[];

  @ApiProperty()
  video: string;

  @ApiProperty()
  certificates: string[];

  @ApiProperty()
  questionone: string;

  @ApiProperty()
  questiontwo: string;

  constructor(user: string, infomation: string, phone: number, include: string[], video: string, certificates: string[], questionone: string, questiontwo: string) {
    this.user = user;
    this.infomation = infomation;
    this.phone = phone;
    this.include = include;
    this.video = video;
    this.certificates = certificates;
    this.questionone = questionone;
    this.questiontwo = questiontwo;
  }
}
