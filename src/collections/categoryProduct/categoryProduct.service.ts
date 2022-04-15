import { Injectable } from '@nestjs/common';
import { Connection, Model } from 'mongoose';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { CategoryProduct } from './schemas/categoryProduct.schema';
import { CreateCategoryProductDto } from './dto/create-categoryProduct.dto';
import { UpdateCategoryProductDto } from './dto/update-categoryProduct.dto';

@Injectable()
export class CategoryProductService {
  constructor(
    @InjectConnection() private connection: Connection,
    @InjectModel(CategoryProduct.name) private categoryProductModel: Model<CategoryProduct>,
  ) { }

  async isEmpty(): Promise<boolean> {
    return (await this.categoryProductModel.estimatedDocumentCount().exec()) == 0;
  }

  async getCategoryProductById(id: string): Promise<any> {
    const result = await this.categoryProductModel.findOne({
      _id: id,
      isDeleted: false,
    });
    return result;
  }

  async getOldPool(projectId: string, poolTitle: string, network: string, chainId: string): Promise<any> {
    // const result = await this.categoryProductModel.aggregate([
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

    const result = await this.categoryProductModel.findOne({ projectId: projectId, poolTitle: poolTitle, network: network, chainId: chainId })

    if (result) {
      return true;
    } else {
      return false;
    }
  }

  async getAllCategoryProduct(): Promise<any> {

    const result = await this.categoryProductModel
      .find().sort([['create_at', 'descending']]).exec()

    return result;
  }

  async createCategoryProduct(
    createCategoryProducttDto: CreateCategoryProductDto,
  ): Promise<any> {
    const model = new this.categoryProductModel({
      ...createCategoryProducttDto,
    });
    const modelRes = await model.save();
    if (modelRes) {
      const obj = modelRes.toObject<Model<CategoryProduct>>();
      // delete obj._id;
      // delete obj.__v;
      return obj;
    }
    return null;
  }

  async updateCategoryProduct(updateCategoryProducttDto: UpdateCategoryProductDto): Promise<any> {
    const { _id, ...rest } = updateCategoryProducttDto;

    const result = await this.categoryProductModel.findOneAndUpdate(
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

  async deleteCategoryProduct(id: string): Promise<any> {
    const result = await this.categoryProductModel.findOneAndUpdate(
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