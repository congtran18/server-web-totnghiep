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

  async create(createMessageDto: CreateMessageDto): Promise<Message> {
    //update da doc tin nhan nguoi khac gui den minh trc khi tao tin nhan minh gui den nguoi khac
    await this.messageModel
      .updateMany({ from: createMessageDto.to, to: createMessageDto.from }, { read: true }, { upsert: false })
      .exec();
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

  async countUnread(params: FilterQuery<Message> = {},): Promise<any> {
    const num = await this.messageModel
      .countDocuments({
        ...params,
      })
      .exec();

    const unreadData = await this.messageModel
      .find({
        ...params,
      })
      .exec();

    return { unreads: unreadData, count: num }
  }

  findOne(id: string): Promise<any> {
    return this.messageModel.findOne({ _id: id }).exec()
  }

  updateUnread(
    targetUser: string,
    id: string,
  ): Promise<any> {
    return this.messageModel
      .updateMany({ from: targetUser, to: id, read: false }, { read: true }, { upsert: false })
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
