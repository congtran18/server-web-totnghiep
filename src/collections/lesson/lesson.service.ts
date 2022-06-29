import { NotFoundException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Connection, Model } from 'mongoose';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Lesson } from './schemas/lesson.schema';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { Boolean } from 'aws-sdk/clients/apigateway';
import moment from "moment";

@Injectable()
export class LessonService {
  constructor(
    @InjectConnection() private connection: Connection,
    @InjectModel(Lesson.name) private lessonModel: Model<Lesson>,
  ) { }

  async isEmpty(): Promise<boolean> {
    return (await this.lessonModel.estimatedDocumentCount().exec()) == 0;
  }

  async getLessonById(id: string): Promise<any> {
    const result = await this.lessonModel.find({
      tutoruid: id,
      // isDeleted: false,
    });
    return result;
  }

  async getAllLesson(page?: string, limit?: string): Promise<any> {
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

  async modifyDateTime(start: Date, end: Date): Promise<Boolean> {
    var query = {
      $and: [
        { start: { $lte: end } },
        { end: { $gte: start } }
      ]
    };
    const result = await this.lessonModel.findOne(query).exec()
    if (result) {
      return false
    }
    return true
  }

  async createLesson(
    createLessontDto: CreateLessonDto,
  ): Promise<any> {

    const { start, end } = createLessontDto

    const check = await this.modifyDateTime(start, end)

    if (!check) {
      return null
    }

    const model = new this.lessonModel({
      ...createLessontDto
    });
    const modelRes = await model.save();
    if (modelRes) {
      // await this.adminsService.updateAdmin({ "uid": modelRes?.uid, "role": "waitinglesson" })
      const obj = modelRes.toObject<Model<Lesson>>();
      // delete obj._id;
      // delete obj.__v;
      return obj;
    }
    return null;
  }

  async updateLesson(id: string, updateLessontDto: UpdateLessonDto): Promise<any> {

    const { start, end } = updateLessontDto

    const check = await this.modifyDateTime(start, end)

    if (!check) {
      return null
    }

    const result = await this.lessonModel.findOneAndUpdate(
      {
        _id: id,
      },
      updateLessontDto,
      {
        new: true,
        useFindAndModify: false,
      },
    );
    return result;
  }



  async removeLesson(id: string): Promise<any> {
    const checkResult = await this.lessonModel.findOne({ _id: id, start: { "$gte": new Date(new Date().getTime() + 24 * 60 * 60 * 1000) } });

    if (!checkResult){
      return null
    }

      try {
        const result = await this.lessonModel.findOneAndRemove({ _id: id });
        return result;
      } catch (err) {
        throw new NotFoundException('Do not find data'); //Return which when not find?
      }
  }
}