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

  async getAllCalendar(page?: string, limit?: string, status?: string, warning?: string, realname?: string, sort?: string, accept?: string): Promise<any> {
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

    // if (realname) {
    //   calendarfilter = { "user": new RegExp(realname, 'i'), ...calendarfilter };
    // }
    // if (status) {
    //   calendarfilter = { "status": { $elemMatch: { $eq: status } }, ...calendarfilter };
    // }
    // if (warning) {
    //   calendarfilter = { "warning": warning, ...calendarfilter };
    // }

    // if (sort !== undefined) {
    //   if (sort === "rating_high") {
    //     calendarSort = { "rating": -1, ...calendarSort };
    //   } else if (sort === "rating_low") {
    //     calendarSort = { "rating": 1, ...calendarSort };
    //   } else if (sort === "revenue_high") {
    //     calendarSort = { "totalrevenue": -1, ...calendarSort };
    //   } else if (sort === "revenue_low") {
    //     calendarSort = { "totalrevenue": 1, ...calendarSort };
    //   } else if (sort === "teaching_minutes_high") {
    //     calendarSort = { "totalTeachingMinutes": -1, ...calendarSort };
    //   } else if (sort === "teaching_minutes_low") {
    //     calendarSort = { "totalTeachingMinutes": 1, ...calendarSort };
    //   } else if (sort === "old") {
    //     calendarSort = { "create_at": 1, ...calendarSort };
    //   }
    // } else {
    //   calendarSort = { 'create_at': -1, ...calendarSort }
    // }

    calendarfilter = { "accept": accept ? JSON.parse(accept?.toLowerCase()) : true, ...calendarfilter };

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
        tutoruid: id,
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
      await this.calendarModel.findOneAndRemove({ tutoruid: id });
      return 'successfully removed calendar';
    } catch (err) {
      throw new NotFoundException('Do not find data'); //Return which when not find?
    }
  }
}