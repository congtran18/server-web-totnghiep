import { Injectable } from '@nestjs/common';
import { Connection, Model } from 'mongoose';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Staking } from './schemas/staking.schema';
import { CreateStakingtDto } from './dto/create-staking.dto';
import { UpdateStakingtDto } from './dto/update-staking.dto';

@Injectable()
export class StakingService {
  constructor(
    @InjectConnection() private connection: Connection,
    @InjectModel(Staking.name) private stakingModel: Model<Staking>,
  ) { }

  async isEmpty(): Promise<boolean> {
    return (await this.stakingModel.estimatedDocumentCount().exec()) == 0;
  }

  async getStakingById(id: string): Promise<any> {
    const result = await this.stakingModel.findOne({
      _id: id,
      isDeleted: false,
    });
    return result;
  }

  async getOldPool(projectId: string, poolTitle: string, network: string, chainId: string): Promise<any> {
    // const result = await this.stakingModel.aggregate([
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

    const result = await this.stakingModel.findOne({ projectId: projectId, poolTitle: poolTitle, network: network, chainId: chainId })

    if (result) {
      return true;
    } else {
      return false;
    }
  }

  async getAllStaking(page?: string, limit?: string): Promise<any> {
    let pageNumber = 1;
    let limitNumber = 100;
    if (page) {
      pageNumber = parseInt(page);
    }

    if (limit) {
      limitNumber = parseInt(limit);
    }

    const result = await this.stakingModel
      .find().sort([['create_at', 'descending']])
      .limit(limitNumber)
      .skip((pageNumber - 1) * limitNumber);

    return result;
  }

  async createStaking(
    createStakingtDto: CreateStakingtDto,
  ): Promise<any> {
    const model = new this.stakingModel({
      ...createStakingtDto,
    });
    const modelRes = await model.save();
    if (modelRes) {
      const obj = modelRes.toObject<Model<Staking>>();
      // delete obj._id;
      // delete obj.__v;
      return obj;
    }
    return null;
  }

  async updateStaking(updateStakingtDto: UpdateStakingtDto): Promise<any> {
    const { _id, ...rest } = updateStakingtDto;

    const result = await this.stakingModel.findOneAndUpdate(
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

  async deleteStaking(id: string): Promise<any> {
    const result = await this.stakingModel.findOneAndUpdate(
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