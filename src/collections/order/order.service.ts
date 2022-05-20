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
    });
    return result;
  }


  async getAllOrder(page?: string, limit?: string, realname?: string, sort?: string, track?: string, type?: string, email?: string): Promise<any> {
    let pageNumber = 1;
    let limitNumber = 100;
    if (page) {
      pageNumber = parseInt(page);
    }

    if (limit) {
      limitNumber = parseInt(limit);
    }

    var orderFilter = {}
    var orderSort = {}
    orderSort = { ...orderSort, 'create_at': -1 }

    if (realname) {
      orderFilter = { "user": new RegExp(realname, 'i'), ...orderFilter };
    }

    if (email !== "all") {
      orderFilter = { "user": email };
    } else {
      //danh sach hoa don cua nguoi dung
      track = "false"
    }

    if (type === "Sách") {
      orderFilter = { "paymentMethod": "Sách" };
    } else if (type === "Khóa học") {
      orderFilter = { "paymentMethod": "Khóa học" };
    }

    if (sort !== undefined) {
      if (sort === "high") {
        orderSort = { "totalPrice": -1, ...orderSort };
      } else if (sort === "low") {
        orderSort = { "totalPrice": 1, ...orderSort };
      } else if (sort === "old") {
        orderSort = { ...orderSort, 'create_at': 1 }
      }
    }

    if (track && JSON.parse(track.toLowerCase())) {
      orderFilter = { "track": true, ...orderFilter };
    } else {
      orderFilter = { "track": false, ...orderFilter };
    }

    const result = await this.orderModel
      .find(orderFilter).sort(orderSort).populate('orderItems.productId')
      .limit(limitNumber)
      .skip((pageNumber - 1) * limitNumber);

    let total = await this.orderModel.countDocuments(orderFilter)

    let totalpage = Math.ceil(total / limitNumber);

    return { 'order': result, 'total': total, 'totalpage': totalpage };
  }

  async getAllRestoreOrder(page?: string, limit?: string, sort?: string, realname?: string): Promise<any> {
    let pageNumber = 1;
    let limitNumber = 100;
    if (page) {
      pageNumber = parseInt(page);
    }

    if (limit) {
      limitNumber = parseInt(limit);
    }

    var orderFilter = {}
    var orderSort = {}
    orderSort = { 'create_at': -1, ...orderSort }

    if (realname) {
      orderFilter = { "realname": new RegExp(realname, 'i'), ...orderFilter };
    }

    if (sort) {
      if (sort === "high") {
        orderSort = { "cost": -1, ...orderSort };
      } else {
        orderSort = { "cost": 1, ...orderSort };
      }
    }

    orderFilter = { "track": true, ...orderFilter };

    const result = await this.orderModel
      .find(orderFilter).sort(orderSort).populate('orderItems.productId')
      .limit(limitNumber)
      .skip((pageNumber - 1) * limitNumber);

    let total = await this.orderModel.countDocuments(orderFilter)

    console.log("total", total)

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

    const result = await this.orderModel.findOneAndUpdate(
      {
        _id: id,
      },
      updateOrdertDto,
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

  async deliveryOrder(id: string): Promise<any> {

    const existOrder = await this.orderModel.findOne({ _id: id })

    const result = await this.orderModel.findOneAndUpdate(
      {
        _id: id,
      },
      {
        isDelivered: !existOrder?.isDelivered,
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