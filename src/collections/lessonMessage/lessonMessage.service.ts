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
    @InjectModel(LessonMessage.name) private lessonMessageModel: Model<LessonMessage>,
  ) { }

  async isEmpty(): Promise<boolean> {
    return (await this.lessonMessageModel.estimatedDocumentCount().exec()) == 0;
  }


  async getAllLessonMessage(page?: string, limit?: string, uid?: string, role?: string): Promise<any> {
    let pageNumber = 1;
    let limitNumber = 100;
    if (page) {
      pageNumber = parseInt(page);
    }

    if (limit) {
      limitNumber = parseInt(limit);
    }

    return this.lessonMessageModel
      .aggregate([
        {
          "$lookup": {
            "from": "users",
            "localField": "useruid",
            "foreignField": "uid",
            "as": "user"
          }
        },
        {
          "$lookup": {
            "from": "tutors",
            "localField": "tutoruid",
            "foreignField": "uid",
            "as": "tutor"
          }
        },
        {
          $match: {
            $and: [
              {
                $or: [
                  { "useruid": uid },
                  { "tutoruid": uid }
                ]
              },
              {
                $or: [
                  { "type": role === "user" ? "removed" : "tutorremoved" },
                  { "type": "booked" }
                ]
              }
            ]
          }
        },
        {
          $unset: [
            "useruid",
            "tutoruid",
            // "identifiers"
          ]
        },
        { $sort: { 'createdAt': -1 } },
        {
          $facet: {
            'lessonMessage':
              [
                { $unwind: '$user' },
                { $unwind: '$tutor' },
                { $skip: (pageNumber - 1) * limitNumber },
                { $limit: limitNumber },
              ],
            'count':
              [
                { $count: "totalCount" },
              ],
          }
        }
      ])
  }

  async createLessonMessage(
    createLessonMessagetDto: CreateLessonMessageDto,
  ): Promise<any> {

    const model = new this.lessonMessageModel({
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

  updateUnread(
    uid: string,
  ): Promise<any> {
    return this.lessonMessageModel
      .updateMany({ $or: [{ tutoruid: uid, read: false }, { useruid: uid, read: false }] }, { read: true }, { upsert: false })
      .exec();
  }

  async countUnread(
    uid: string,
  ): Promise<any> {
    const result = await this.lessonMessageModel.countDocuments({ $or: [{ tutoruid: uid, read: false }, { useruid: uid, read: false }] })
    return result;
  }

}