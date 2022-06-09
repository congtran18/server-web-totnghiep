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
            "from": "users",
            "localField": "to",
            "foreignField": "uid",
            "as": "tutor"
          }
        },
        {
          $unwind: "$user",

        },
        {
          $unwind: "$tutor"
        },
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
        }
      ])

  }

  findOne(id: string): Promise<any> {
    return this.warningTutorModel.findOne({ _id: id }).exec()
  }

  update(
    id: string,
    updateWarningTutorDto: UpdateWarningTutorDto,
  ): Promise<any> {
    return this.warningTutorModel
      .findOneAndUpdate({ _id: id }, { ...updateWarningTutorDto }, { useFindAndModify: false, new: true })
      .exec();
  }

  remove(id: string): Promise<any> {
    return this.warningTutorModel.findOneAndRemove({ uid: id }).exec();
  }
}
