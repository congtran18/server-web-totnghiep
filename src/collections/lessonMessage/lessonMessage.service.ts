import { NotFoundException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Connection, Model } from 'mongoose';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { LessonMessage } from './schemas/lessonMessage.schema';
import { CreateLessonMessageDto } from './dto/create-lesson-message.dto';

@Injectable()
export class LessonMessageService {
  constructor(
    @InjectConnection() private connection: Connection,
    @InjectModel(LessonMessage.name) private lessonModel: Model<LessonMessage>,
  ) { }

  async isEmpty(): Promise<boolean> {
    return (await this.lessonModel.estimatedDocumentCount().exec()) == 0;
  }


  async getAllLessonMessage(page?: string, limit?: string): Promise<any> {
    let pageNumber = 1;
    let limitNumber = 100;
    if (page) {
      pageNumber = parseInt(page);
    }

    if (limit) {
      limitNumber = parseInt(limit);
    }

    var lessonfilter = {}
    var lessonSort = {}

    const result = await this.lessonModel
      .find(lessonfilter).sort(lessonSort)
      .limit(limitNumber)
      .skip((pageNumber - 1) * limitNumber);

    let total = await this.lessonModel.countDocuments(lessonfilter)

    total = Math.ceil(total / limitNumber);

    return { 'lesson': result, 'total': total };
  }

  async createLessonMessage(
    createLessonMessagetDto: CreateLessonMessageDto,
  ): Promise<any> {

    const model = new this.lessonModel({
      ...createLessonMessagetDto
    });
    const modelRes = await model.save();
    if (modelRes) {
      // await this.adminsService.updateAdmin({ "uid": modelRes?.uid, "role": "waitinglesson" })
      const obj = modelRes.toObject<Model<LessonMessage>>();
      // delete obj._id;
      // delete obj.__v;
      return obj;
    }
    return null;
  }

}