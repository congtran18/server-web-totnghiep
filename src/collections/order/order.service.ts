import { NotFoundException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Connection, Model } from 'mongoose';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Order } from './schemas/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectConnection() private connection: Connection,
    @InjectModel(Order.name) private orderModel: Model<Order>,
  ) { }

  async isEmpty(): Promise<boolean> {
    return (await this.orderModel.estimatedDocumentCount().exec()) == 0;
  }

  async getOrderById(id: string): Promise<any> {
    const result = await this.orderModel.findOne({
      _id: id,
      // isDeleted: false,
    }).populate('type').populate('category');
    return result;
  }

  async getOldPool(projectId: string, poolTitle: string, network: string, chainId: string): Promise<any> {
    // const result = await this.orderModel.aggregate([
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

    const result = await this.orderModel.findOne({ projectId: projectId, poolTitle: poolTitle, network: network, chainId: chainId })

    if (result) {
      return true;
    } else {
      return false;
    }
  }

  async getAllOrder(page?: string, limit?: string, type?: string, category?: string, realname?: string): Promise<any> {
    let pageNumber = 1;
    let limitNumber = 100;
    if (page) {
      pageNumber = parseInt(page);
    }

    if (limit) {
      limitNumber = parseInt(limit);
    }

    var orderfilter = {}

    if (realname) {
      orderfilter = { "realname": new RegExp(realname, 'i'), ...orderfilter };
    }
    if (type) {
      console.log(type)
      orderfilter = { "type": type, ...orderfilter };
    }
    if (category) {
      orderfilter = { "category": category, ...orderfilter };
    }

    orderfilter = { "track": false, ...orderfilter };

    const result = await this.orderModel
      .find(orderfilter).sort([['create_at', 'descending']]).populate('type').populate('category')
      .limit(limitNumber)
      .skip((pageNumber - 1) * limitNumber);

    let total = await this.orderModel.countDocuments(orderfilter)

    total = Math.ceil(total / limitNumber);

    return { 'order': result, 'total': total };
  }

  async getAllRestoreOrder(page?: string, limit?: string, type?: string, category?: string, realname?: string): Promise<any> {
    let pageNumber = 1;
    let limitNumber = 100;
    if (page) {
      pageNumber = parseInt(page);
    }

    if (limit) {
      limitNumber = parseInt(limit);
    }

    var orderfilter = {}

    if (realname) {
      orderfilter = { "realname": new RegExp(realname, 'i'), ...orderfilter };
    }
    if (type) {
      console.log(type)
      orderfilter = { "type": type, ...orderfilter };
    }
    if (category) {
      orderfilter = { "category": category, ...orderfilter };
    }

    orderfilter = { "track": true, ...orderfilter };

    const result = await this.orderModel
      .find(orderfilter).sort([['create_at', 'descending']]).populate('type').populate('category')
      .limit(limitNumber)
      .skip((pageNumber - 1) * limitNumber);

    let total = await this.orderModel.countDocuments(orderfilter)

    total = Math.ceil(total / limitNumber);

    return { 'order': result, 'total': total };
  }

  async createOrder(
    createOrdertDto: CreateOrderDto,
  ): Promise<any> {

    const model = new this.orderModel({
      ...createOrdertDto
    });
    const modelRes = await model.save();
    if (modelRes) {
      const obj = modelRes.toObject<Model<Order>>();
      // delete obj._id;
      // delete obj.__v;
      return obj;
    }
    return null;
  }

  async updateOrder(id: string, updateOrdertDto: UpdateOrderDto): Promise<any> {

    const { slideImage, ...rest } = updateOrdertDto

    if (slideImage) {
      slideImage.forEach(async (element) => {
        const existOrderImage = await this.orderModel.findOne({ _id: id, 'slideImage.index': element.index });

        if (element.data === "delete") {
          await this.orderModel.findOneAndUpdate(
            { _id: id },
            {
              $pull : {
                'slideImage': { "index": element.index },
              },
            },
          );
        } else if (existOrderImage) {
          await this.orderModel.findOneAndUpdate(
            { _id: id, 'slideImage.index': element.index },
            {
              'slideImage.$.index': element.index,
              'slideImage.$.data': element.data,
            },
            {
              upsert: true,
            }
          );
        } else {
          await this.orderModel.findOneAndUpdate(
            { _id: id },
            {
              $push: {
                slideImage: {
                  index: element.index,
                  data: element.data,
                },
              },
            },
            {
              upsert: true,
            }
          );
        }
      });
    }


    const result = await this.orderModel.findOneAndUpdate(
      {
        _id: id,
      },
      rest,
      {
        new: true,
        useFindAndModify: false,
      },
    );
    return result;
  }

  async deleteOrder(id: string): Promise<any> {

    const existOrder = await this.orderModel.findOne({ _id: id })

    const result = await this.orderModel.findOneAndUpdate(
      {
        _id: id,
      },
      {
        track: !existOrder?.track,
      },
      {
        new: true,
        useFindAndModify: false,
      },
    );
    return result;
  }

  async removeOrder(id: string): Promise<any> {
    try {
      await this.orderModel.findOneAndRemove({ _id: id });
      return 'successfully removed order';
    } catch (err) {
      throw new NotFoundException('Do not find data'); //Return which when not find?
    }
  }
}