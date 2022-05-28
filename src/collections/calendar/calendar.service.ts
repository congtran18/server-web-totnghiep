import { NotFoundException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Connection, Model } from 'mongoose';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Calendar } from './schemas/calendar.schema';
import { CreateCalendarDto } from './dto/create-calendar.dto';
import { UpdateCalendarDto } from './dto/update-calendar.dto';

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

  async createCalendar(
    createCalendartDto: CreateCalendarDto,
  ): Promise<any> {

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
    try {
      await this.calendarModel.findOneAndRemove({ _id: id });
      return 'successfully removed calendar';
    } catch (err) {
      throw new NotFoundException('Do not find data'); //Return which when not find?
    }
  }
}