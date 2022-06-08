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
    const { to , from } = createReviewTutorDto
    const existReview = await this.reviewTutorModel.findOne({
      from: from,
      to : to
      // isDeleted: false,
    });
    if(existReview){
      return null
    }
    const createdReviewTutor = new this.reviewTutorModel(createReviewTutorDto);
    return createdReviewTutor.save();
  }

  findAll(
    params: FilterQuery<ReviewTutor> = {},
  ): Promise<ReviewTutor[]> {
    return this.reviewTutorModel
      .find({
        ...params,
      })
      .exec();
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

  remove(id: string): Promise<any> {
    return this.reviewTutorModel.findOneAndRemove({ uid: id }).exec();
  }
}
