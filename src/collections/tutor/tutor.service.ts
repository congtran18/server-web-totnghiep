import { NotFoundException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Connection, Model } from 'mongoose';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Tutor } from './schemas/tutor.schema';
import { CreateTutorDto } from './dto/create-tutor.dto';
import { UpdateTutorDto } from './dto/update-tutor.dto';

@Injectable()
export class TutorService {
  constructor(
    @InjectConnection() private connection: Connection,
    @InjectModel(Tutor.name) private tutorModel: Model<Tutor>,
  ) { }

  async isEmpty(): Promise<boolean> {
    return (await this.tutorModel.estimatedDocumentCount().exec()) == 0;
  }

  async getTutorById(id: string): Promise<any> {
    const result = await this.tutorModel.findOne({
      _id: id,
      // isDeleted: false,
    }).populate('type').populate('category');
    return result;
  }

  async getOldPool(projectId: string, poolTitle: string, network: string, chainId: string): Promise<any> {
    // const result = await this.tutorModel.aggregate([
    //   // where: {
    //   //   contractIsFinished: false,
    //   //   contractIsFail: false,
    //   //   // contractPoolSync: false,// chua sync
    //   //   // smartContractAddress: {neq: null},
    //   //   // chainId: {neq: null},
    //   //   // network: 'bsc',
    //   // },
    //   //{ contractIsFinished: false }, { contractIsFail: false }, 
    //   { $match: { $and: [{ projectId: projectId }, { poolTitle: poolTitle }, { network: network }, { chainId: chainId }] } }
    // ]);

    const result = await this.tutorModel.findOne({ projectId: projectId, poolTitle: poolTitle, network: network, chainId: chainId })

    if (result) {
      return true;
    } else {
      return false;
    }
  }

  async getAllTutor(page?: string, limit?: string, type?: string, warning?: string, realname?: string, totalTeachingMinutes?: string, totalrevenue?: string, sort?: string): Promise<any> {
    let pageNumber = 1;
    let limitNumber = 100;
    if (page) {
      pageNumber = parseInt(page);
    }

    if (limit) {
      limitNumber = parseInt(limit);
    }

    var tutorfilter = {}
    var tutorSort = {}
    tutorSort = { 'create_at': -1, ...tutorSort }

    if (realname) {
      tutorfilter = { "user": new RegExp(realname, 'i'), ...tutorfilter };
    }
    if (type) {
      tutorfilter = { "type": type, ...tutorfilter };
    }
    if (warning) {
      tutorfilter = { "warning": warning, ...tutorfilter };
    }

    if (sort) {
      if (sort === "high") {
        tutorSort = { "cost": -1, ...tutorSort };
      } else {
        tutorSort = { "cost": 1, ...tutorSort };
      }
    }


    tutorfilter = { "track": false, ...tutorfilter };

    const result = await this.tutorModel
      .find(tutorfilter).sort(tutorSort)
      .limit(limitNumber)
      .skip((pageNumber - 1) * limitNumber);

    let total = await this.tutorModel.countDocuments(tutorfilter)

    total = Math.ceil(total / limitNumber);

    return { 'tutor': result, 'total': total };
  }

  async getAllRestoreTutor(page?: string, limit?: string, type?: string, category?: string, realname?: string): Promise<any> {
    let pageNumber = 1;
    let limitNumber = 100;
    if (page) {
      pageNumber = parseInt(page);
    }

    if (limit) {
      limitNumber = parseInt(limit);
    }

    var tutorfilter = {}

    if (realname) {
      tutorfilter = { "realname": new RegExp(realname, 'i'), ...tutorfilter };
    }
    if (type) {
      tutorfilter = { "type": type, ...tutorfilter };
    }
    if (category) {
      tutorfilter = { "category": category, ...tutorfilter };
    }

    tutorfilter = { "track": true, ...tutorfilter };

    const result = await this.tutorModel
      .find(tutorfilter).sort([['create_at', 'descending']]).populate('type').populate('category')
      .limit(limitNumber)
      .skip((pageNumber - 1) * limitNumber);

    let total = await this.tutorModel.countDocuments(tutorfilter)

    total = Math.ceil(total / limitNumber);

    return { 'tutor': result, 'total': total };
  }

  async createTutor(
    createTutortDto: CreateTutorDto,
  ): Promise<any> {

    const model = new this.tutorModel({
      ...createTutortDto
    });
    const modelRes = await model.save();
    if (modelRes) {
      const obj = modelRes.toObject<Model<Tutor>>();
      // delete obj._id;
      // delete obj.__v;
      return obj;
    }
    return null;
  }

  async updateTutor(id: string, updateTutortDto: UpdateTutorDto): Promise<any> {


    const result = await this.tutorModel.findOneAndUpdate(
      {
        _id: id,
      },
      updateTutortDto,
      {
        new: true,
        useFindAndModify: false,
      },
    );
    return result;
  }

  async deleteTutor(id: string): Promise<any> {

    const existTutor = await this.tutorModel.findOne({ _id: id })

    const result = await this.tutorModel.findOneAndUpdate(
      {
        _id: id,
      },
      {
        track: !existTutor?.accept,
      },
      {
        new: true,
        useFindAndModify: false,
      },
    );
    return result;
  }

  async removeTutor(id: string): Promise<any> {
    try {
      await this.tutorModel.findOneAndRemove({ _id: id });
      return 'successfully removed tutor';
    } catch (err) {
      throw new NotFoundException('Do not find data'); //Return which when not find?
    }
  }
}