import { NotFoundException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Connection, Model } from 'mongoose';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Calendar } from './schemas/calendar.schema';
import { CreateCalendarDto } from './dto/create-calendar.dto';
import { UpdateCalendarDto } from './dto/update-calendar.dto';
import { Boolean } from 'aws-sdk/clients/apigateway';
import moment from "moment";

@Injectable()
export class CalendarService {
  constructor(
    @InjectConnection() private connection: Connection,
    @InjectModel(Calendar.name) private calendarModel: Model<Calendar>,
  ) { }

  async isEmpty(): Promise<boolean> {
    return (await this.calendarModel.estimatedDocumentCount().exec()) == 0;
  }

  async getCalendarById(id: string): Promise<any> {
    const result = await this.calendarModel.find({
      tutoruid: id,
      // isDeleted: false,
    });
    return result;
  }

  async getAllCalendar(page?: string, limit?: string): Promise<any> {
    let pageNumber = 1;
    let limitNumber = 100;
    if (page) {
      pageNumber = parseInt(page);
    }

    if (limit) {
      limitNumber = parseInt(limit);
    }

    var calendarfilter = {}
    var calendarSort = {}

    const result = await this.calendarModel
      .find(calendarfilter).sort(calendarSort)
      .limit(limitNumber)
      .skip((pageNumber - 1) * limitNumber);

    let total = await this.calendarModel.countDocuments(calendarfilter)

    total = Math.ceil(total / limitNumber);

    return { 'calendar': result, 'total': total };
  }

  async modifyDateTime(tutor: string, start: Date, end: Date): Promise<Boolean> {
    var query = {
      $and: [
        { tutoruid: tutor },
        { start: { $lte: end } },
        { end: { $gte: start } }
      ]
    };
    const result = await this.calendarModel.findOne(query).exec()
    if (result) {
      return false
    }
    return true
  }

  async createCalendar(
    createCalendartDto: CreateCalendarDto,
  ): Promise<any> {

    const { start, end, tutoruid } = createCalendartDto

    const check = await this.modifyDateTime(tutoruid, start, end)

    if (!check) {
      return null
    }

    const model = new this.calendarModel({
      ...createCalendartDto
    });
    const modelRes = await model.save();
    if (modelRes) {
      // await this.adminsService.updateAdmin({ "uid": modelRes?.uid, "role": "waitingcalendar" })
      const obj = modelRes.toObject<Model<Calendar>>();
      // delete obj._id;
      // delete obj.__v;
      return obj;
    }
    return null;
  }

  async updateCalendar(id: string, updateCalendartDto: UpdateCalendarDto): Promise<any> {

    const { start, end } = updateCalendartDto

    const check = await this.modifyDateTime("123", start, end)

    if (!check) {
      return null
    }

    const result = await this.calendarModel.findOneAndUpdate(
      {
        _id: id,
      },
      updateCalendartDto,
      {
        new: true,
        useFindAndModify: false,
      },
    );
    return result;
  }



  async removeCalendar(id: string): Promise<any> {
    const checkResult = await this.calendarModel.findOne({ _id: id, start: { "$gte": new Date(new Date().getTime() + 24 * 60 * 60 * 1000) } });

    if (!checkResult) {
      return null
    }

    try {
      const result = await this.calendarModel.findOneAndRemove({ _id: id });
      return result;
    } catch (err) {
      throw new NotFoundException('Do not find data'); //Return which when not find?
    }
  }
}