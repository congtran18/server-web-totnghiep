import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Date, Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import {
  validate,
  validateOrReject,
  Contains,
  IsInt,
  Length,
  IsEmail,
  IsFQDN,
  IsDate,
  Min,
  Max,
} from 'class-validator';

export type ProjectDocument = Project & Document;

const env = require('dotenv').config().parsed


@Schema()
export class Project extends Document {

  @ApiProperty()
  @Prop()
  tokenAddress: string;

  @ApiProperty()
  @Prop({ required: true, index: true })
  tokenName: string;

  @ApiProperty()
  @IsInt()
  @Min(0)
  @Max(18)
  @Prop()
  coinDecimals: string;

  @ApiProperty()
  @Prop()
  coinSymbol: string;

  @ApiProperty()
  @IsInt()
  @Prop()
  totalSupply: number;

  @ApiProperty()
  @Prop({ enum: ['Soft', 'Hard'], default: 'Hard' })
  saleType: string;

  @ApiProperty()
  @Prop()
  softCap: number;

  @ApiProperty()
  @Prop()
  hardCap: number;

  @ApiProperty()
  @IsInt()
  @Min(0)
  @Prop()
  tokensForSale: string;

  @ApiProperty()
  @Prop()
  pricePerToken: number;

  @ApiProperty()
  @Prop({ default: 0 })
  totalRaise: number;

  @ApiProperty()
  @Prop({ default: "5%" })
  fee: string;

  @ApiProperty()
  @Prop()
  initialLiquidityBnb: string;

  @ApiProperty()
  @Prop()
  initialLiquidityToken: string;

  @ApiProperty()
  @Prop()
  shortDescription: string;

  @ApiProperty()
  @Prop()
  longDescription: string;

  @ApiProperty()
  @Prop()
  logoUrl: string;

  @ApiProperty()
  @Prop()
  bannerUrl: string;

  @ApiProperty()
  @Prop()
  twitterLink: string;

  @ApiProperty()
  @Prop()
  telegramLink: string;

  @ApiProperty()
  @Prop()
  mediumLink: string;

  @ApiProperty()
  @Prop()
  email: string;

  @ApiProperty()
  @Prop()
  linkedInLink: string;

  @ApiProperty()
  @Prop()
  websiteLink: string;

  @ApiProperty()
  @Prop()
  whitepaperLink: string;

  @ApiProperty()
  @Prop({ type: Date })
  startStaking: Date;

  @ApiProperty()
  @Prop({ type: Date })
  startSale: Date;

  @ApiProperty()
  @Prop({ type: Date })
  endSale: Date;

  @ApiProperty()
  @Prop()
  athPrices: string;

  @ApiProperty()
  @Prop()
  initialMarketCap: number;

  @ApiProperty()
  @Prop()
  status: string;

  @ApiProperty()
  @Prop()
  statusProject: string;

  @ApiProperty()
  @Prop({ enum: [0, 1, 2, 3], default: 0 })
  step: number;

  @ApiProperty()
  @Prop()
  chainId: string;

  @ApiProperty()
  @Prop()
  network: string;

  @ApiProperty()
  @Prop()
  contractIsFinished: boolean;

  @ApiProperty()
  @Prop()
  contractIsFail: boolean;

  @ApiProperty()
  @Prop()
  contractIsFinishedSetup: boolean;

  @ApiProperty()
  @Prop({ type: Date, default: Date.now })
  create_at: Date;

  @ApiProperty()
  @Prop({ type: Date, default: Date.now })
  update_at: Date;

  @ApiProperty()
  @Prop({ type: Date })
  deposit_at: Date;

  @ApiProperty()
  @Prop({ default: '12345678' })
  smartContractAddress: string;

  @ApiProperty()
  @Prop()
  contractTokenRate: string;

  @ApiProperty()
  @Prop()
  contractExchangeRate: string;

  @ApiProperty()
  @Prop()
  contractIsInitialized: boolean;

  @ApiProperty()
  @Prop()
  contractProjectId: number;

  @ApiProperty()
  @Prop()
  contractSaleStep: number;

  @ApiProperty()
  @Prop()
  contractTotalRaise: number;

  @ApiProperty()
  @Prop()
  contractStakedAmount: number;

  @ApiProperty()
  @Prop()
  contractSoldAmount: number;

  @ApiProperty()
  @Prop()
  contractTotalRedeemed: number;

  @ApiProperty()
  @Prop()
  kyc: boolean;

  @ApiProperty()
  @Prop()
  auditStatus: boolean;

  @ApiProperty()
  @Prop()
  contractPoolAddress: string;

  @ApiProperty()
  @Prop()
  athPrice: number;

  @ApiProperty()
  @Prop()
  owner: string;

  @ApiProperty()
  @Prop()
  stakeTokenAddress: string;

  @ApiProperty()
  @Prop()
  stakeTokenName: string;

  @ApiProperty()
  @Prop()
  stakeTokenSymbol: string;

  @ApiProperty()
  @Prop()
  stakeTokenDecimals: string;

  @ApiProperty()
  @Prop({ default: false })
  contractPoolSync: boolean;


  constructor(
    // doc: any,
    tokenAddress: string,
    tokenName: string,
    coinDecimals: string,
    coinSymbol: string,
    totalSupply: number,
    saleType: string,
    softCap: number,
    hardCap: number,
    tokensForSale: string,
    pricePerToken: number,
    totalRaise: number,
    fee: string,
    initialLiquidityBnb: string,
    initialLiquidityToken: string,
    shortDescription: string,
    longDescription: string,
    logoUrl: string,
    bannerUrl: string,
    twitterLink: string,
    telegramLink: string,
    mediumLink: string,
    email: string,
    linkedInLink: string,
    websiteLink: string,
    whitepaperLink: string,
    startStaking: Date,
    startSale: Date,
    endSale: Date,
    athPrices: string,
    initialMarketCap: number,
    status: string,
    statusProject: string,
    step: number,
    chainId: string,
    network: string,
    contractIsFinished: boolean,
    contractIsFail: boolean,
    contractIsFinishedSetup: boolean,
    create_at: Date,
    update_at: Date,
    deposit_at: Date,
    smartContractAddress: string,
    contractTokenRate: string,
    contractExchangeRate: string,
    contractIsInitialized: boolean,
    contractProjectId: number,
    contractSaleStep: number,
    contractTotalRaise: number,
    contractStakedAmount: number,
    contractSoldAmount: number,
    contractTotalRedeemed: number,
    kyc: boolean,
    auditStatus: boolean,
    contractPoolAddress: string,
    athPrice: number,
    owner: string,
    stakeTokenAddress: string,
    stakeTokenName: string,
    stakeTokenSymbol: string,
    stakeTokenDecimals: string,
    contractPoolSync: boolean
  ) {
    super();

    this.tokenAddress = tokenAddress;
    this.tokenName = tokenName;
    this.coinDecimals = coinDecimals;
    this.coinSymbol = coinSymbol;
    this.totalSupply = totalSupply;
    this.saleType = saleType;
    this.softCap = softCap;
    this.hardCap = hardCap;
    this.tokensForSale = tokensForSale;
    this.pricePerToken = pricePerToken;
    this.totalRaise = totalRaise;
    this.fee = fee;
    this.initialLiquidityBnb = initialLiquidityBnb;
    this.initialLiquidityToken = initialLiquidityToken;
    this.shortDescription = shortDescription;
    this.longDescription = longDescription;
    this.logoUrl = logoUrl;
    this.bannerUrl = bannerUrl;
    this.twitterLink = twitterLink;
    this.telegramLink = telegramLink;
    this.mediumLink = mediumLink;
    this.email = email;
    this.linkedInLink = linkedInLink;
    this.websiteLink = websiteLink;
    this.whitepaperLink = whitepaperLink;
    this.startStaking = startStaking;
    this.startSale = startSale;
    this.endSale = endSale;
    this.athPrices = athPrices;
    this.initialMarketCap = initialMarketCap;
    this.status = status;
    this.statusProject = statusProject;
    this.step = step;
    this.chainId = chainId;
    this.network = network;
    this.contractIsFinished = contractIsFinished;
    this.contractIsFail = contractIsFail;
    this.contractIsFinishedSetup = contractIsFinishedSetup;
    this.create_at = create_at;
    this.update_at = update_at;
    this.deposit_at = deposit_at;
    this.smartContractAddress = smartContractAddress;
    this.contractTokenRate = contractTokenRate;
    this.contractExchangeRate = contractExchangeRate;
    this.contractIsInitialized = contractIsInitialized;
    this.contractProjectId = contractProjectId;
    this.contractSaleStep = contractSaleStep;
    this.contractTotalRaise = contractTotalRaise;
    this.contractStakedAmount = contractStakedAmount;
    this.contractSoldAmount = contractSoldAmount;
    this.contractTotalRedeemed = contractTotalRedeemed;
    this.kyc = kyc;
    this.auditStatus = auditStatus;
    this.contractPoolAddress = contractPoolAddress;
    this.athPrice = athPrice;
    this.owner = owner;
    this.stakeTokenName = stakeTokenName;
    this.stakeTokenAddress = stakeTokenAddress;
    this.stakeTokenSymbol = stakeTokenSymbol;
    this.stakeTokenDecimals = stakeTokenDecimals;
    this.contractPoolSync = contractPoolSync;
  }
}

export const ProjectSchema = SchemaFactory.createForClass(Project);