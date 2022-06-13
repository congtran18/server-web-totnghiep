import { NotFoundException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { CreateWarningTutorDto } from './dto/create-warningTutor.dto';
import { UpdateWarningTutorDto } from './dto/update-warningTutor.dto';
import { WarningTutor } from './schemas/warningTutor.schema';

@Injectable()
export class WarningTutorService {
  constructor(
    @InjectModel(WarningTutor.name)
    private readonly warningTutorModel: Model<WarningTutor>,
  ) { }

  async create(createWarningTutorDto: CreateWarningTutorDto): Promise<WarningTutor | null> {
    const { to, from } = createWarningTutorDto
    const existReview = await this.warningTutorModel.findOne({
      from: from,
      to: to
      // isDeleted: false,
    });
    if (existReview) {
      return null
    }
    const createdWarningTutor = new this.warningTutorModel(createWarningTutorDto);
    return createdWarningTutor.save();
  }

  async findAll(
    params: FilterQuery<WarningTutor> = {},
  ): Promise<WarningTutor[]> {
    return this.warningTutorModel
      .aggregate([
        {
          "$lookup": {
            "from": "users",
            "localField": "from",
            "foreignField": "uid",
            "as": "user"
          }
        },
        {
          "$lookup": {
            "from": "tutors",
            "localField": "to",
            "foreignField": "uid",
            "as": "tutor"
          }
        },
        // {
        //   $unwind: "$user",

        // },
        // {
        //   $unwind: "$tutor"
        // },
        // {
        //   $replaceWith: {
        //     $mergeObjects: [
        //       "$$ROOT",
        //       "$identifiers"
        //     ]
        //   }
        // },
        {
          $unset: [
            "from",
            "to",
            // "identifiers"
          ]
        },
        { $sort: { 'creatAt': -1 } },
        {
          $facet: {
            'warnings':
              [
                { $unwind: '$user' },
                { $unwind: '$tutor' },
              ],
            'count':
              [
                { $count: "totalCount" },
              ],
          }
        }
      ])

  }

  async findOne(id: string): Promise<any> {
    const result = await this.warningTutorModel.findOne({ _id: id }).exec()
    return result
  }

  update(
    id: string,
    updateWarningTutorDto: UpdateWarningTutorDto,
  ): Promise<any> {
    return this.warningTutorModel
      .findOneAndUpdate({ _id: id }, { ...updateWarningTutorDto }, { useFindAndModify: false, new: true })
      .exec();
  }

  async acceptWarning(id: string): Promise<any> {

    const existWarning = await this.warningTutorModel.findOne({ _id: id })

    if (existWarning) {

      const result = await this.warningTutorModel.findOneAndUpdate(
        {
          _id: id,
        },
        {
          accept: !existWarning?.accept,
        },
        {
          new: true,
          useFindAndModify: false,
        },
      );
      return result;
    }
    return null;
  }

  async removeWarning(tutor: string, user: string): Promise<any> {
    try {
      await this.warningTutorModel.findOneAndRemove({ tutor: tutor, user: user });
      return 'Xóa tố cáo thành công';
    } catch (err) {
      throw new NotFoundException('Do not find data'); //Return which when not find?
    }
  }
}
