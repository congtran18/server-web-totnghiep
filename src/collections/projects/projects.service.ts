import { NotFoundException } from '@nestjs/common';
import { Connection, Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { Project } from './schemas/project.schema';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { CreateProjectDto } from './dto/create-project.dto';
import moment from 'moment';

const acKeys = [
  'tokenAddress',
  'tokenName',
  'coinDecimals',
  'coinSymbol',
  'totalSupply',
  'saleType',
  'softCap',
  'hardCap',
  'tokensForSale',
  'pricePerToken',
  'totalRaise',
  'fee',
  'initialLiquidityBnb',
  'initialLiquidityToken',
  'shortDescription',
  'longDescription',
  'bannerUrl',
  'logoUrl',
  'bannerUrl',
  'linkedInLink',
  'mediumLink',
  'email',
  'telegramLink',
  'twitterLink',
  'websiteLink',
  'whitepaperLink',
  'startStaking',
  'startSale',
  'endSale',
  'athPrices',
  'initialMarketCap',
  'step',
  'chainId',
  'network',
  'smartContractAddress',
  'kyc',
  'auditStatus',
  'athPrice',
  'update_at',
  'deposit_at'
];

const acKeysWeb3 = [
  'tokenAddress',
  'tokenName',
  'coinDecimals',
  'coinSymbol',
  'totalSupply',
  'saleType',
  'softCap',
  'hardCap',
  'tokensForSale',
  'pricePerToken',
  'totalRaise',
  'fee',
  'initialLiquidityBnb',
  'initialLiquidityToken',
  'shortDescription',
  'longDescription',
  'bannerUrl',
  'logoUrl',
  'bannerUrl',
  'linkedInLink',
  'mediumLink',
  'email',
  'telegramLink',
  'twitterLink',
  'websiteLink',
  'whitepaperLink',
  'startStaking',
  'startSale',
  'endSale',
  'athPrices',
  'initialMarketCap',
  'step',
  'chainId',
  'network',
  'smartContractAddress',
  'contractTokenRate',
  'contractExchangeRate',
  'contractIsInitialized',
  'contractIsFinishedSetup',
  'contractIsFinished',
  'contractIsFail',
  'contractProjectId',
  'contractSaleStep',
  'contractTotalRaise',
  'contractStakedAmount',
  'contractSoldAmount',
  'contractTotalRedeemed',
  'contractPoolAddress',
  'kyc',
  'auditStatus',
  'athPrice',
  'stakeTokenAddress',
  'stakeTokenName',
  'stakeTokenSymbol',
  'stakeTokenDecimals',
  'contractPoolSync',
  'update_at'
];
import { Logger } from '@nestjs/common';

const NETWORKS = ['ethereum', 'bsc', 'polkadot', 'solana'];
const STATUS_PROJECT = {
  Draft: 'Draft',
  ComingSoon: 'Coming Soon',
  StakingNow: 'Staking',
  Live: 'Live',
  PrivateSale: 'Private Sale',
  PubicSale: 'Public Sale',
  StartSale: 'Start Sale',
  EndSale: 'End Sale', // status when end sale but dont press complete button
  Pass: 'Pass',
  Fail: 'Fail',
};
const SORT_OPTIONS = {
  Newest: 'newest',
  Oldest: 'oldest',
  HighestStaked: 'highest_staked',
  LowestStaked: 'lowest_staked',
};

const FILTER_OPTIONS = {
  Draft: 'draft',
  ComingSoon: 'coming_soon',
  StakingNow: 'staking',
  Live: 'live',
  PrivateSale: 'private_sale',
  PubicSale: 'public_sale',
  StartSale: 'start_sale',
  EndSale: 'end_sale',
  Pass: 'pass',
  Fail: 'fail',
};

const getProjectStatus = (item) => {
  const currentDate = moment().unix();
  const stakingStartDate = moment(item.startStaking).unix();
  const saleStartDate = moment(item.startSale).unix();

  const liveEndDate = moment(item.startSale)
    // .add(process.env.PUBLIC_SALE_DURATION || 24 * 60, 'minutes')

    .add(process.env.PUBLIC_SALE_DURATION || 15, 'minutes')
    .unix(); //add 24h in saleStartDate
  const saleEndDate = moment(item.endSale).unix();
  let currentState = STATUS_PROJECT.EndSale; // > sale end time but not finish

  if (item.step <= 2) {
    currentState = STATUS_PROJECT.Draft;
  }
  if (item.step === 3 && currentDate < stakingStartDate) {
    currentState = STATUS_PROJECT.ComingSoon;
  } else if (currentDate >= stakingStartDate && currentDate < saleStartDate) {
    currentState = STATUS_PROJECT.StakingNow;
  } else if (currentDate >= liveEndDate && currentDate < saleEndDate) {
    currentState = STATUS_PROJECT.PubicSale;
  } else if (currentDate >= saleStartDate && currentDate < liveEndDate) {
    currentState = STATUS_PROJECT.PrivateSale;
  } else if (currentDate >= saleEndDate) {
    currentState = STATUS_PROJECT.EndSale;
  }
  if (item.contractIsFinished && !item.contractIsFail) {
    currentState = STATUS_PROJECT.Pass;
  }
  if (item.contractIsFinished && item.contractIsFail) {
    currentState = STATUS_PROJECT.Fail;
  }

  return currentState;
};

@Injectable()
export class ProjectsService {
  constructor(
    @InjectConnection() private connection: Connection,
    @InjectModel(Project.name) private projectModel: Model<Project>,
  ) { }

  async insertNewProject(projectDto: CreateProjectDto): Promise<any> {
    const proModel = new this.projectModel(projectDto);
    return await proModel.save();
  }

  async getSingleProject(id: string): Promise<any> {
    const project = await this.projectModel.findOne({
      $or: [{ _id: id }],
    });
    if (project) {
      const currentState = { currentState: await getProjectStatus(project) };
      const proOb = await project.toObject();
      return await { ...proOb, ...currentState };
      // return await { ...proOb };
    } else {
      return null;
    }
  }

  async removeProject(id: string): Promise<any> {
    try {
      await this.projectModel.findOneAndRemove({ _id: id });
      return 'successfully removed';
    } catch (err) {
      throw new NotFoundException('Do not find data'); //Return which when not find?
    }
  }

  async editProject(id: string, projectDto: CreateProjectDto): Promise<any> {
    // const project = await this.projectModel.findOne({ _id: id });
    // await this.verifySign(project, false);
    // // PATCH A PROJECT
    try {
      const existproject = await this.projectModel.findOne({ _id: id }).lean();
      const extractValues = await Object.entries(projectDto);
      const set = { $set: {} };
      for (const value of extractValues) {
        if (acKeys.includes(value[0])) {
          set.$set[value[0]] = value[1];
        }
      }
      if (set.$set['step'] === 3 && set.$set['step'] !== existproject?.step) {
        set.$set['deposit_at'] = new Date();
      }
      set.$set['update_at'] = new Date();
      await this.projectModel.findOneAndUpdate({ _id: id }, set, { new: true, useFindAndModify: false }).exec();
      return this.projectModel.findOne({ _id: id });
    } catch (error) {
      throw new NotFoundException('Can not update'); //Return which when error?
    }
  }

  async filterProject(
    // options?: { foo }, //No option
    // network?: string,
    filter?: string,
    sort?: string,
    search?: string,
    // contractOwner?: string,
    // setup?: string,
    // chainId?: string,
    page?: string,
    size?: string,
  ): Promise<any> {
    // const authRole = _.get(
    //     options,
    //     'accessToken.roles.0',
    //     _.get(options, 'accessToken.role', ''),
    //   ).toString()

    ////////////--- Should setup Default page and limit????
    let pageNumber = 0;
    let limit = 10;
    if (page) {
      pageNumber = parseInt(page);
    }
    if (size) {
      limit = parseInt(size);
    }
    ///////////////
    const aggregation = [{ $match: {} }, { $sort: {} }];
    const matcher = aggregation[0].$match;
    const sorter = aggregation[1].$sort;

    if (search) {
      Object.assign(matcher, {
        $or: [
          { tokenName: { $regex: new RegExp(search.toString(), 'i') } },
          { tokenAddress: { $regex: new RegExp(search.toString(), 'i') } },
        ],
      });
    }

    // if (contractOwner) {
    //   Object.assign(matcher, {
    //     $or: [
    //       {
    //         contractOwner,
    //       },
    //       // and in staked users
    //       { stakedUsers: contractOwner },
    //       // and in buyer
    //       { participantUsers: contractOwner },
    //     ],
    //   });
    // }

    // if (chainId) {
    //   const mainnets = mainnetChainId;
    //   const isMainnet = mainnets.includes(chainId);
    //   if (isMainnet) {
    //     Object.assign(matcher, {
    //       chainId: { $in: mainnets },
    //     });
    //   } else {
    //     Object.assign(matcher, {
    //       chainId: { $nin: mainnets },
    //     });
    //   }
    // }

    // if (setup === '1') {
    //   Object.assign(matcher, {
    //     contractIsFinishedSetup: true,
    //   });
    // }
    // if (setup === '0') {
    //   Object.assign(matcher, {
    //     contractIsFinishedSetup: false,
    //   });
    // }

    // if (network) {
    //   if (NETWORKS.includes(network)) {
    //     Object.assign(matcher, {
    //       network,
    //     });
    //   }
    // }

    switch (sort) {
      default:
        Object.assign(sorter, {
          created_at: 1,
        });
        break;
      case SORT_OPTIONS.Oldest:
        Object.assign(sorter, {
          created_at: -1,
        });
      case SORT_OPTIONS.Newest:
        Object.assign(sorter, {
          created_at: 1,
        });
        // case SORT_OPTIONS.HighestStaked: // TODO: clarify this sort
        //   Object.assign(sorter, {
        //     contractStakedAmount: -1,
        //   });
        //   break;
        // case SORT_OPTIONS.LowestStaked: // TODO: clarify this sort
        //   Object.assign(sorter, {
        //     contractStakedAmount: 1,
        //   });
        break;
    }

    switch (filter) {
      default:
        break;
      case FILTER_OPTIONS.ComingSoon:
        Object.assign(matcher, {
          currentState: STATUS_PROJECT.ComingSoon,
        });
        break;
      case FILTER_OPTIONS.Live:
        Object.assign(matcher, {
          currentState: STATUS_PROJECT.Live,
        });
        break;
      case FILTER_OPTIONS.PubicSale:
        Object.assign(matcher, {
          currentState: STATUS_PROJECT.PubicSale,
        });
        break;
      case FILTER_OPTIONS.EndSale:
        Object.assign(matcher, {
          currentState: STATUS_PROJECT.EndSale,
        });
        break;
      case FILTER_OPTIONS.EndSale:
        Object.assign(matcher, {
          currentState: STATUS_PROJECT.Pass,
        });
        break;
      case FILTER_OPTIONS.StakingNow:
        Object.assign(matcher, {
          currentState: STATUS_PROJECT.StakingNow,
        });
        break;
      case FILTER_OPTIONS.EndSale:
        Object.assign(matcher, {
          currentState: STATUS_PROJECT.Draft,
        });
        break;
      case FILTER_OPTIONS.Fail:
        Object.assign(matcher, {
          currentState: STATUS_PROJECT.Fail,
        });
        break;
    }

    const projects = await this.projectModel.aggregate([
      {
        $addFields: {
          stakingStartDateToLong: {
            $toLong: '$startStaking',
          },
          stakingEndDateToLong: {
            $toLong: '$startSale',
          },
          saleStartDateToLong: {
            $toLong: '$startSale',
          },
          liveEndDateToLong: {
            $sum: [
              {
                $toLong: '$startSale',
              },
              (Number(process.env.PUBLIC_SALE_DURATION || 15)
              ) * 60 * 1000, // add 1 day to saleStartDate // 10 minute for test //HERE ADD PROCESS.ENV
            ],
          },
          saleEndDateToLong: {
            $toLong: '$endSale',
          },
          currentStateToLong: {
            $toLong: new Date().getTime(),
          },
        },
      },
      {
        $addFields: {
          currentState: {
            $cond: [
              {
                $and: [
                  {
                    $eq: ['$contractIsFinished', true],
                  },
                  {
                    $eq: ['$contractIsFail', false],
                  },
                ],
              },
              STATUS_PROJECT.Pass,
              {
                $cond: [
                  {
                    $and: [
                      {
                        $eq: ['$contractIsFinished', true],
                      },
                      {
                        $eq: ['$contractIsFail', true],
                      },
                    ],
                  },
                  STATUS_PROJECT.Fail,
                  {
                    $cond: [
                      {
                        $and: [
                          {
                            $eq: ['$step', 3],
                          },
                          {
                            $gt: [
                              '$currentStateToLong',
                              '$saleEndDateToLong',
                            ],
                          },
                        ],
                      },
                      STATUS_PROJECT.EndSale,
                      {
                        $cond: [
                          {
                            $and: [
                              {
                                $eq: ['$step', 3],
                              },
                              {
                                $gte: [
                                  '$currentStateToLong',
                                  '$liveEndDateToLong',
                                ],
                              },
                              {
                                $lt: [
                                  '$currentStateToLong',
                                  '$saleEndDateToLong',
                                ],
                              },
                            ],
                          },
                          STATUS_PROJECT.PubicSale,
                          {
                            $cond: [
                              {
                                $and: [
                                  {
                                    $eq: ['$step', 3],
                                  },
                                  {
                                    $gte: [
                                      '$currentStateToLong',
                                      '$saleStartDateToLong',
                                    ],
                                  },
                                  {
                                    $lt: [
                                      '$currentStateToLong',
                                      '$liveEndDateToLong',
                                    ],
                                  },
                                ],
                              },
                              STATUS_PROJECT.PrivateSale,
                              {
                                $cond: [
                                  {
                                    $and: [
                                      {
                                        $eq: ['$step', 3],
                                      },
                                      {
                                        $gte: [
                                          '$currentStateToLong',
                                          '$stakingStartDateToLong',
                                        ],
                                      },
                                      {
                                        $lt: [
                                          '$currentStateToLong',
                                          '$saleStartDateToLong',
                                        ],
                                      },
                                    ],
                                  },
                                  STATUS_PROJECT.StakingNow,
                                  {
                                    $cond: [
                                      {
                                        $and: [
                                          {
                                            $eq: ['$step', 3],
                                          },
                                          {
                                            $lt: [
                                              '$currentStateToLong',
                                              '$stakingStartDateToLong',
                                            ],
                                          },
                                        ],
                                      },
                                      STATUS_PROJECT.ComingSoon,
                                      STATUS_PROJECT.Draft,
                                    ],
                                  },
                                ],
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        },
      },
      {
        $addFields: {
          id: '$_id',
        },
      },
      {
        $match: {
          ...matcher,
        },
      },
      // { $unset: ['stakedUsers', 'participantUsers'] },
      { $sort: { deposit_at: -1 } },
      // { $skip: pageNumber },
      // { $limit: limit },
      {
        $facet: {
          'Results': [
            { $skip: pageNumber * limit },
            { $limit: limit },
          ],
          'count': [
            {
              $count: 'totalCount'
            }
          ]
        }
      }
    ]);

    return projects;
  }

  // async getOverview(chainId: string) {
  //   const projects = await this.projectModel
  //     .find({
  //       contractIsFinished: true,
  //       contractIsFail: false,
  //       chainId: chainId,
  //     })
  //     .where('smartContractAddress')
  //     .ne(null);

  //   const rs = projects.reduce(
  //     (crr, next) => {
  //       crr.totalProject += 1;
  //       crr.totalfund += next.hardCap || 0;
  //       crr.totalLocked +=
  //         (next.lockedValue || 0) * (next.hardCap / next.availableForPurchase);
  //       crr.totalMarketCap +=
  //         (next.initialSupply || 0) *
  //         (next.hardCap / next.availableForPurchase);

  //       return crr;
  //     },
  //     {
  //       totalProject: 0,
  //       totalfund: 0,
  //       totalLocked: 0,
  //       totalMarketCap: 0,
  //     },
  //   );
  //   return rs;
  // }

  async getDetail(address: string, chainId: string) {
    const chosenProject = await this.projectModel.findOne({
      contractTokenAddress: address,
      chainId,
    });
    return chosenProject;
  }

  async getCronProject() {
    const choosenProject = await this.projectModel.aggregate([
      // where: {
      //   contractIsFinished: false,
      //   contractIsFail: false,
      //   // contractPoolSync: false,// chua sync
      //   // smartContractAddress: {neq: null},
      //   // chainId: {neq: null},
      //   // network: 'bsc',
      // },
      //{ contractIsFinished: false }, { contractIsFail: false }, 
      { $match: { $and: [{ smartContractAddress: { $nin: [null] } }, { chainId: { $nin: [null] } }, { network: 'bsc' }, { network: 'bsc' }] } }
    ]);
    return choosenProject;
  }

  async getCronProjectSucess() {
    const choosenProject = await this.projectModel.aggregate([
      { $match: { $and: [{ contractIsFinished: true }, { contractIsFail: false }, { smartContractAddress: { $nin: [null] } }, { chainId: { $nin: [null] } }, { network: 'bsc' }] } }
    ]);

    return choosenProject;
  }

  async updateAtribute(id, updateAttrs) {
    // delete updateAttrs._id;
    // const test = await this.projectModel.findOneAndUpdate(id, { $set:  { contractTokenRate : updateAttrs.contractTokenRate } } , { new: true ,useFindAndModify: false }).exec();
    // console.log(test)
    try {
      const extractValues = await Object.entries(updateAttrs);
      const set = { $set: {} };
      for (const value of extractValues) {
        if (acKeysWeb3.includes(value[0])) {
          set.$set[value[0]] = value[1];
        }
      }
      set.$set['update_at'] = new Date();
      await this.projectModel.findOneAndUpdate({ _id: id }, set, { new: true, useFindAndModify: false }).exec();
      return this.projectModel.findOne({ _id: id });
    } catch (error) {
      throw new NotFoundException('Can not update'); //Return which when error?
    }
  }
}