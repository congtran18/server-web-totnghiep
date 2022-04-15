import { Injectable } from '@nestjs/common';
import { Connection, Model } from 'mongoose';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { TypeProduct } from './schemas/typeProduct.schema';
import { CreateTypeProductDto } from './dto/create-typeProduct.dto';
import { UpdateTypeProductDto } from './dto/update-typeProduct.dto';

@Injectable()
export class TypeProductService {
  constructor(
    @InjectConnection() private connection: Connection,
    @InjectModel(TypeProduct.name) private typeProductModel: Model<TypeProduct>,
  ) { }

  async isEmpty(): Promise<boolean> {
    return (await this.typeProductModel.estimatedDocumentCount().exec()) == 0;
  }

  async getTypeProductById(id: string): Promise<any> {
    const result = await this.typeProductModel.findOne({
      _id: id,
      isDeleted: false,
    });
    return result;
  }

  async getOldPool(projectId: string, poolTitle: string, network: string, chainId: string): Promise<any> {
    // const result = await this.typeProductModel.aggregate([
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

    const result = await this.typeProductModel.findOne({ projectId: projectId, poolTitle: poolTitle, network: network, chainId: chainId })

    if (result) {
      return true;
    } else {
      return false;
    } 
  } 

  async getAllTypeProduct(): Promise<any> {

    const result = await this.typeProductModel.find().populate('categoryProduct').sort([['create_at', 'descending']]).exec();

    return result;
  }

  async createTypeProduct(
    createTypeProducttDto: CreateTypeProductDto,
  ): Promise<any> {
    const model = new this.typeProductModel({
      ...createTypeProducttDto,
    });
    const modelRes = await model.save();
    if (modelRes) {
      const obj = modelRes.toObject<Model<TypeProduct>>();
      // delete obj._id;
      // delete obj.__v;
      return obj;
    }
    return null;
  }

  async updateTypeProduct(updateTypeProducttDto: UpdateTypeProductDto): Promise<any> {
    const { _id, ...rest } = updateTypeProducttDto;

    const result = await this.typeProductModel.findOneAndUpdate(
      {
        _id: _id,
      },
      rest,
      {
        new: true,
        useFindAndModify: false,
      },
    );
    return result;
  }

  async deleteTypeProduct(id: string): Promise<any> {
    const result = await this.typeProductModel.findOneAndUpdate(
      {
        _id: id,
      },
      {
        isDeleted: true,
      },
      {
        new: true,
        useFindAndModify: false,
      },
    );
    return result;
  }
}