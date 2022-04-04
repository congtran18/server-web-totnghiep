import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

@Schema()
export class Staking extends Document {
  @ApiProperty()
  @Prop()
  projectId: string;

  @ApiProperty()
  @Prop()
  poolTitle: string;

  @ApiProperty()
  @Prop()
  description: string;

  @ApiProperty()
  @Prop()
  network: string;

  @ApiProperty()
  @Prop()
  chainId: string;

  @ApiProperty()
  @Prop()
  coinSymbol: string;

  @ApiProperty()
  @Prop()
  rewardPriceDataSource: string;

  @ApiProperty()
  @Prop()
  mainCoinImage: string;

  @ApiProperty()
  @Prop()
  smallerCoinImage: string;

  @ApiProperty()
  @Prop()
  stakeTokenAddress: string;

  @ApiProperty()
  @Prop()
  stakeTokenSymbol: string;

  @ApiProperty()
  @Prop()
  stakeTokenDecimals: number;

  @ApiProperty()
  @Prop()
  rewardTokenAddress: string;

  @ApiProperty()
  @Prop()
  rewardTokenSymbol: string;

  @ApiProperty()
  @Prop()
  rewardTokenDecimals: number;

  @ApiProperty()
  @Prop()
  stakeContractAddress: string;

  @ApiProperty()
  @Prop({ enum: ['UPCOMING', 'LIVE', 'PRIVATE'], default: 'UPCOMING' })
  status: string;

  @ApiProperty()
  @Prop()
  order: number;

  @ApiProperty()
  @Prop({ default: false })
  isFrozen: boolean;

  @ApiProperty()
  @Prop({ default: false })
  isMaster: boolean;

  @ApiProperty()
  @Prop({ type: Date, default: Date.now })
  create_at: Date;

  @ApiProperty()
  @Prop({ type: Date, default: Date.now })
  update_at: Date;

  constructor(
    projectId: string,
    network: string,
    poolTitle: string,
    coinSymbol: string,
    description: string,
    mainCoinImage: string,
    smallerCoinImage: string,
    chainId: string,
    rewardPriceDataSource: string,
    stakeTokenSymbol: string,
    stakeTokenDecimals: number,
    rewardTokenAddress: string,
    stakeTokenAddress: string,
    rewardTokenSymbol: string,
    rewardTokenDecimals: number,
    stakeContractAddress: string,
    status: string,
    order: number,
    isFrozen: boolean,
    isMaster: boolean,
    create_at: Date,
    update_at: Date
  ) {
    super();
    this.projectId = projectId;
    this.network = network;
    this.poolTitle = poolTitle;
    this.coinSymbol = coinSymbol;
    this.description = description;
    this.mainCoinImage = mainCoinImage;
    this.smallerCoinImage = smallerCoinImage;
    this.chainId = chainId;
    this.rewardPriceDataSource = rewardPriceDataSource;
    this.stakeTokenAddress = stakeTokenAddress;
    this.stakeTokenSymbol = stakeTokenSymbol;
    this.stakeTokenDecimals = stakeTokenDecimals;
    this.rewardTokenAddress = rewardTokenAddress;
    this.rewardTokenSymbol = rewardTokenSymbol;
    this.rewardTokenDecimals = rewardTokenDecimals;
    this.stakeContractAddress = stakeContractAddress;
    this.status = status;
    this.order = order;
    this.isFrozen = isFrozen;
    this.isMaster = isMaster;
    this.create_at= create_at;
    this.update_at = update_at;
  }
}

export const StakingSchema = SchemaFactory.createForClass(Staking);
