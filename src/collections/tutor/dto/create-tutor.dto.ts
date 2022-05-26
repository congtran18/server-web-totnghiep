import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";

export class CreateTutorDto {

  @IsNotEmpty()
  @ApiProperty()
  user: string;

  @IsNotEmpty()
  @ApiProperty()
  uid: string;

  @ApiProperty()
  realname: string;

  @ApiProperty()
  infomation: string;

  @ApiProperty()
  phone: number;

  @ApiProperty()
  account: string;

  @ApiProperty()
  bank: string;

  @ApiProperty()
  include: string[];

  @ApiProperty()
  imageUrl: string;

  @ApiProperty()
  videoUrl: string;

  @ApiProperty()
  certificates: { dataUrl: string, name: string }[];

  @ApiProperty()
  questionone: string;

  @ApiProperty()
  questiontwo: string;

  constructor(user: string, uid: string, realname: string, infomation: string, phone: number, account: string, bank: string, include: string[], imageUrl: string, videoUrl: string, certificates: { dataUrl: string, name: string }[], questionone: string, questiontwo: string) {
    this.user = user;
    this.uid = uid;
    this.realname = realname;
    this.infomation = infomation;
    this.phone = phone;
    this.account = account;
    this.bank = bank;
    this.include = include;
    this.imageUrl = imageUrl;
    this.videoUrl = videoUrl;
    this.certificates = certificates;
    this.questionone = questionone;
    this.questiontwo = questiontwo;
  }
}
