import { NotFoundException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { CreateReviewTutorDto } from './dto/create-reviewTutor.dto';
import { UpdateReviewTutorDto } from './dto/update-reviewTutor.dto';
import { ReviewTutor } from './schemas/reviewTutor.schema';

@Injectable()
export class ReviewTutorService {
  constructor(
    @InjectModel(ReviewTutor.name)
    private readonly reviewTutorModel: Model<ReviewTutor>,
  ) { }

  async create(createReviewTutorDto: CreateReviewTutorDto): Promise<ReviewTutor | null> {
    const { to, from } = createReviewTutorDto
    const existReview = await this.reviewTutorModel.findOne({
      from: from,
      to: to
      // isDeleted: false,
    });

    if (existReview) {
      return null
    }

    const createdReviewTutor = new this.reviewTutorModel(createReviewTutorDto);
    return createdReviewTutor.save();
  }

  async findAll(
    params: FilterQuery<ReviewTutor> = {},
  ): Promise<ReviewTutor[]> {
    // return this.reviewTutorModel
    //   .find({
    //     ...params,
    //   })
    //   .exec();

    const result = await this.reviewTutorModel.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "from",
          foreignField: "uid",
          as: "user_vote"
        }
      },
      {
        $match: {
          $and: [
            { ...params },
          ]
        }
      },
      { $sort: { createdAt : -1} },
      {
        $facet: {
          'all_review':
            [
              { $unwind: '$user_vote' },
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

  findOne(id: string): Promise<any> {
    return this.reviewTutorModel.findOne({ _id: id }).exec()
  }

  update(
    id: string,
    updateReviewTutorDto: UpdateReviewTutorDto,
  ): Promise<any> {
    return this.reviewTutorModel
      .findOneAndUpdate({ _id: id }, { ...updateReviewTutorDto }, { useFindAndModify: false, new: true })
      .exec();
  }

  async removeReview(from: string, to: string): Promise<any> {
    try {
      await this.reviewTutorModel.findOneAndRemove({ from: from, to: to });
      return 'Xóa review thành công';
    } catch (err) {
      throw new NotFoundException('Do not find data'); //Return which when not find?
    }
  }
}
