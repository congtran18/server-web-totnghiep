import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty()
  tokenAddress: string;

  @ApiProperty()
  tokenName: string;

  @ApiProperty()
  coinDecimals: string;

  @ApiProperty()
  coinSymbol: string;

  @ApiProperty()
  totalSupply: number;

  @ApiProperty()
  saleType: string;

  @ApiProperty()
  softCap: number;

  @ApiProperty()
  hardCap: number;

  @ApiProperty()
  tokensForSale: string;

  @ApiProperty()
  pricePerToken: number;

  @ApiProperty()
  totalRaise: number;

  @ApiProperty()
  fee: string;

  @ApiProperty()
  initialLiquidityBnb: string;

  @ApiProperty()
  initialLiquidityToken: string;

  @ApiProperty()
  shortDescription: string;

  @ApiProperty()
  longDescription: string;

  @ApiProperty()
  @IsString()
  logoUrl: string;

  @ApiProperty()
  @IsString()
  bannerUrl: string;

  @ApiProperty()
  twitterLink: string;

  @ApiProperty()
  telegramLink: string;

  @ApiProperty()
  mediumLink: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  linkedInLink: string;

  @ApiProperty()
  websiteLink: string;

  @ApiProperty()
  whitepaperLink: string;

  @ApiProperty()
  startStaking: Date;

  @ApiProperty()
  startSale: Date;

  @ApiProperty()
  endSale: Date;

  @ApiProperty()
  athPrices: string;

  @ApiProperty()
  initialMarketCap: number;

  @ApiProperty()
  status: string;

  @ApiProperty()
  statusProject: string;

  @ApiProperty()
  step: number;

  @ApiProperty()
  chainId: string;

  @ApiProperty()
  network: string;

  @ApiProperty()
  create_at: Date;

  @ApiProperty()
  update_at: Date;

  @ApiProperty()
  deposit_at: Date;

  @ApiProperty()
  smartContractAddress: string;

  @ApiProperty()
  kyc: boolean;

  @ApiProperty()
  auditStatus: boolean;

  @ApiProperty()
  athPrice: number;

  @ApiProperty()
  owner: string;

  constructor(
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
    create_at: Date,
    update_at: Date,
    deposit_at: Date,
    smartContractAddress: string,
    kyc: boolean,
    auditStatus: boolean,
    athPrice: number,
    owner: string
  ) {
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
    this.create_at = create_at;
    this.update_at = update_at;
    this.deposit_at = deposit_at;
    this.smartContractAddress = smartContractAddress;
    this.kyc = kyc;
    this.auditStatus = auditStatus;
    this.athPrice = athPrice;
    this.owner = owner;
    // this.stakingStartDate = stakingStartDate;
    // this.stakingEndDate = stakingEndDate;
    // this.saleStartDate = saleStartDate;
    // this.saleEndDate = saleEndDate;
    // this.contractIsDeploy = contractIsDeploy;
  }
}