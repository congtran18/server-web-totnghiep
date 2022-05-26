import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";

export class UpdateTutorDto {

  @ApiProperty()
  realname: string;

  @ApiProperty()
  infomation: string;

  @ApiProperty()
  phone: number;

  @ApiProperty()
  status: string[];

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

  constructor(realname: string ,infomation: string, phone: number, status: string[], include: string[], imageUrl: string, videoUrl: string, certificates: { dataUrl: string, name: string }[], questionone: string, questiontwo: string) {
    this.realname = realname;
    this.infomation = infomation;
    this.phone = phone;
    this.status = status;
    this.include = include;
    this.imageUrl = imageUrl;
    this.videoUrl = videoUrl;
    this.certificates = certificates;
    this.questionone = questionone;
    this.questiontwo = questiontwo;
  }
}
