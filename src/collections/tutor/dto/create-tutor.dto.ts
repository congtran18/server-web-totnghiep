import {IsNotEmpty} from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";

export class CreateTutorDto {

  @IsNotEmpty()
  @ApiProperty()
  user: string;

  @IsNotEmpty()
  @ApiProperty()
  uid: string;

  @ApiProperty()
  infomation: string;

  @ApiProperty()
  phone: number;

  @ApiProperty()
  include: string[];

  @ApiProperty()
  videoUrl: string;

  @ApiProperty()
  certificates: { dataUrl: string, name: string }[];

  @ApiProperty()
  questionone: string;

  @ApiProperty()
  questiontwo: string;

  constructor(user: string, uid: string, infomation: string, phone: number, include: string[], videoUrl: string, certificates: { dataUrl: string, name: string }[], questionone: string, questiontwo: string) {
    this.user = user;
    this.uid = uid;
    this.infomation = infomation;
    this.phone = phone;
    this.include = include;
    this.videoUrl = videoUrl;
    this.certificates = certificates;
    this.questionone = questionone;
    this.questiontwo = questiontwo;
  }
}
