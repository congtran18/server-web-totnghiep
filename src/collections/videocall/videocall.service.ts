import { NotFoundException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Connection, Model } from 'mongoose';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Videocall } from './schemas/videocall.schema';
import { CreateVideocallDto } from './dto/create-videocall.dto';

@Injectable()
export class VideocallService {
  constructor(
    @InjectConnection() private connection: Connection,
    @InjectModel(Videocall.name) private videocallModel: Model<Videocall>,
  ) { }

  async isEmpty(): Promise<boolean> {
    return (await this.videocallModel.estimatedDocumentCount().exec()) == 0;
  }

  async getVideocallById(id: string): Promise<any> {
    const result = await this.videocallModel.findOne({
      _id: id,
      // isDeleted: false,
    });
    return result;
  }


  async getAllVideocall(page?: string, limit?: string, realname?: string, sort?: string, uid?: string): Promise<any> {
    let pageNumber = 1;
    let limitNumber = 100;
    if (page) {
      pageNumber = parseInt(page);
    }

    if (limit) {
      limitNumber = parseInt(limit);
    }

    var videocallFilter = {}
    var videocallSort = {}
    videocallSort = { ...videocallSort, 'create_at': -1 }

    if (realname) {
      videocallFilter = { "tutor.fullName": new RegExp(realname, 'i'), ...videocallFilter };
    }

    if (sort !== undefined) {
      if (sort === "old") {
        videocallSort = { ...videocallSort, 'create_at': 1 }
      }
    }

    const result = await this.videocallModel.aggregate([
      {
        $lookup: {
          from: "tutors",
          localField: "tutor",
          foreignField: "uid",
          as: "user_videocall"
        }
      },
      {
        $match: {
          $and: [
            { "user": uid },
            realname ? { "user_videocall.user_videocall.fullName": new RegExp(realname, 'i') } : {},
          ]
        }
      },
      { $sort: videocallSort },
      {
        $facet: {
          'user_videocall':
            [
              { $unwind: '$user_videocall' },
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
    return result;
  }

  async createVideocall(
    createVideocalltDto: CreateVideocallDto,
  ): Promise<any> {

    const model = new this.videocallModel({
      ...createVideocalltDto
    });
    const modelRes = await model.save();
    if (modelRes) {
      const obj = modelRes.toObject<Model<Videocall>>();
      // delete obj._id;
      // delete obj.__v;
      return obj;
    }
    return null;
  }

  async removeVideocall(id: string): Promise<any> {
    try {
      await this.videocallModel.findOneAndRemove({ _id: id });
      return 'successfully removed videocall';
    } catch (err) {
      throw new NotFoundException('Do not find data'); //Return which when not find?
    }
  }
}