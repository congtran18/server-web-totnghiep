import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";

export class UpdateTutorDto {

  @ApiProperty()
  fullName: string;

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

  constructor(fullName: string ,infomation: string, phone: number, status: string[], include: string[], imageUrl: string, videoUrl: string, certificates: { dataUrl: string, name: string }[], questionone: string, questiontwo: string) {
    this.fullName = fullName;
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
