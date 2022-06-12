import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Message } from './schemas/message.schema';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name)
    private readonly messageModel: Model<Message>,
  ) { }

  create(createMessageDto: CreateMessageDto): Promise<Message> {
    const createdMessage = new this.messageModel(createMessageDto);
    return createdMessage.save();
  }

  findAll(
    params: FilterQuery<Message> = {},
  ): Promise<Message[]> {
    return this.messageModel
      .find({
        ...params,
      })
      .exec();
  }

  countUnread(params: FilterQuery<Message> = {},): Promise<any> {
    return this.messageModel
      .countDocuments({
        ...params,
      })
      .exec();
  }

  findOne(id: string): Promise<any> {
    return this.messageModel.findOne({ _id: id }).exec()
  }

  updateUnread(
    targetUser: string,
    id: string,
  ): Promise<any> {
    return this.messageModel
      .updateMany({ from: targetUser, to: id }, { read: true }, { upsert: false })
      .exec();
  }

  update(
    id: string,
    updateMessageDto: UpdateMessageDto,
  ): Promise<any> {
    return this.messageModel
      .findOneAndUpdate({ _id: id }, { ...updateMessageDto }, { useFindAndModify: false, new: true })
      .exec();
  }

  remove(id: string): Promise<any> {
    return this.messageModel.findOneAndRemove({ uid: id }).exec();
  }
}
