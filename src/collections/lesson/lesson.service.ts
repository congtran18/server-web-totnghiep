import { NotFoundException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Connection, Model } from 'mongoose';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Lesson } from './schemas/lesson.schema';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { Boolean } from 'aws-sdk/clients/apigateway';
import moment from "moment";
import endOfDay from 'date-fns/endOfDay';
import startOfDay from 'date-fns/startOfDay';

@Injectable()
export class LessonService {
  constructor(
    @InjectConnection() private connection: Connection,
    @InjectModel(Lesson.name) private lessonModel: Model<Lesson>,
  ) { }

  async isEmpty(): Promise<boolean> {
    return (await this.lessonModel.estimatedDocumentCount().exec()) == 0;
  }

  async getLessonById(id: string, start: Date, end: Date): Promise<any> {
    console.log("id", id)
    console.log("start", start)
    console.log("end", end)
    const result = await this.lessonModel.find({
      // isDeleted: false,
      $and: [
        { tutoruid: id },
        { end: { $lt: end } },
        { start: { $gt: start } }
      ]
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

  subtractHours(numOfHours: number, date = new Date()) {
    date.setHours(date.getHours() - numOfHours);
    return date;
  }

  async modifyDateTime(user: string, start: Date, end: Date): Promise<Boolean> {
    // const today = moment().startOf('day')
    const startday = this.subtractHours(7, new Date(moment(start).startOf('day').toDate())).toISOString()
    const endday = this.subtractHours(7, new Date(moment(start).endOf('day').toDate())).toISOString()

    var query = {
      $and: [
        { user: user },
        {
          start: {
            $gte: startday,
            $lte: endday
          }
        },
        // { end: { $gt: start } }
      ]
    };
    const result = await this.lessonModel.findOne(query).exec()

    if (result) {
      return false
    }
    return true
  }

  async modifyExistDateTime(tutoruid: string, start: Date, end: Date): Promise<Boolean> {
    var query = {
      $and: [
        { tutoruid: tutoruid },
        { start: { $lt: end } },
        { end: { $gt: start } }
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

    const { start, end, user, tutoruid } = createLessontDto

    console.log("start nek", start)
    console.log("new date nek", new Date())
    console.log("new date nek", new Date().toISOString())

    const checkbooking = await this.modifyDateTime(user, start, end)// check hoc vien da dat lich hoc trong khoang tg nay chua

    const checksame = await this.modifyExistDateTime(tutoruid, start, end)// check hoc vien co dat lich trung voi hoc vien khac ko

    if (!checkbooking) {
      return 'booked'
    }

    if (!checksame) {
      return 'same'
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

    // const check = await this.modifyDateTime( ,start, end)

    // if (!check) {
    //   return null
    // }

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

  async checkCallTutor(tutoruid: string, user: string): Promise<any> {
    console.log("tutoruid", tutoruid)
    console.log("user", user)
    const startday = this.subtractHours(7, new Date(moment(new Date().toISOString()).startOf('day').toDate())).toISOString()
    const endday = this.subtractHours(7, new Date(moment(new Date().toISOString()).endOf('day').toDate())).toISOString()

    console.log("date start", startday)
    console.log("date end", endday)
    var querycheckbooked = {
      $and: [
        { user: user },
        // { tutoruid: tutoruid },
        {
          start: {
            $gte: startday,
            $lte: endday
          }
        },
        // { end: { $gt: start } }
      ]
    };//check lich hoc co trong ngay

    var querycheckbookedtutor = {
      $and: [
        { user: user },
        { tutoruid: tutoruid },
        {
          start: {
            $gte: startday,
            $lte: endday
          }
        },
        // { end: { $gt: start } }
      ]
    };//check lich hoc co trong ngay voi 1 gia su cu the

    var querychecklessontutor = {
      $and: [
        // { user: user },
        { tutoruid: tutoruid },
        { start: { $lte: new Date().toISOString() } },
        { end: { $gte: new Date().toISOString() } }
        // { end: { $gt: start } }
      ]
    };

    var querychecklesson = {
      $and: [
        { tutoruid: tutoruid },
        { user: user },
        { start: { $lt: new Date().toISOString() } },
        { end: { $gt: new Date().toISOString() } }
      ]
    };
    const checkbooked = await this.lessonModel.findOne(querycheckbooked).exec()
    const checkbookedtutor = await this.lessonModel.findOne(querycheckbookedtutor).exec()
    const checklesson = await this.lessonModel.findOne(querychecklesson).exec()
    const checklessontutor = await this.lessonModel.findOne(querychecklessontutor).exec()

    console.log("checkbooked", checkbooked)
    console.log("checkbookedtutor", checkbookedtutor)
    console.log("checklesson", checklesson)
    if (checkbooked && !checkbookedtutor) {
      //khi nguoi dung co lich hoc truoc va call ko dung gia su
      return "not true tutor"
    } else if (checkbooked && checkbookedtutor && !checklesson) {
      // khi nguoi dung co lich hoc truoc, call dung gia su nhung ko dung thoi gian dat truoc
      return "not true time"
    } else if (checkbooked && checkbookedtutor && checklesson) {
      // khi nguoi dung co lich hoc truoc, call dung gia su va trong thoi gian dat truoc
      return "call lesson"
    } else if (checklessontutor) {
      // khi nguoi dung ko dat truoc call vao thoi diem nguoi dung da dat
      return "tutor calling"
    }
    else {
      // khi nguoi dung ko dat lich truoc => call thong thuong
      return "regular call"
    }
  }// check hien tai co phai trong thoi gian hoc


  async tutorCheckLesson(tutoruid: string, user: string): Promise<any> {

    var querychecklesson = {
      $and: [
        { tutoruid: tutoruid },
        { user: user },
        { start: { $lt: new Date().toISOString() } },
        { end: { $gt: new Date().toISOString() } }
      ]
    };
    const checklessontutor = await this.lessonModel.findOne(querychecklesson).exec()

    if (checklessontutor) {
      // gia su dang trong lich dat truoc
      return "call lesson"
    }

    return "regular call"

  }

  async removeLessonByTutor(tutoruid: string, start: Date, end: Date): Promise<any> {
    var query = {
      $and: [
        { tutoruid: tutoruid },
        { start: { $gte: start } },
        { end: { $lte: end } }
      ]
    };
    await this.lessonModel.deleteMany(query)
    return null
  }

  async removeLesson(id: string): Promise<any> {
    const checkResult = await this.lessonModel.findOne({ _id: id, start: { "$gte": new Date(new Date().getTime() + 24 * 60 * 60 * 1000) } });

    if (!checkResult) {
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