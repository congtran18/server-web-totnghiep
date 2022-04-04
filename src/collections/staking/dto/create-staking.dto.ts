import { ApiProperty } from '@nestjs/swagger';

export class CreateStakingtDto {

  @ApiProperty()
  projectId: string;

  @ApiProperty()
  poolTitle: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  network: string;

  @ApiProperty()
  chainId: string;

  @ApiProperty()
  coinSymbol: string;

  @ApiProperty()
  rewardPriceDataSource: string;

  @ApiProperty()
  mainCoinImage: string;

  @ApiProperty()
  smallerCoinImage: string;

  @ApiProperty()
  stakeTokenAddress: string;

  @ApiProperty()
  stakeTokenSymbol: string;

  @ApiProperty()
  stakeTokenDecimal: number;

  @ApiProperty()
  rewardTokenAddress: string;

  @ApiProperty()
  rewardTokenSymbol: string;

  @ApiProperty()
  rewardTokenDecimal: number;

  @ApiProperty()
  stakeContractAddress: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  order: number;

  @ApiProperty()
  isFrozen: boolean;

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
    stakeTokenDecimal: number,
    rewardTokenAddress: string,
    stakeTokenAddress: string,
    rewardTokenSymbol: string,
    rewardTokenDecimal: number,
    stakeContractAddress: string,
    status: string,
    order: number,
    isFrozen: boolean,
  ) {
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
    this.stakeTokenDecimal = stakeTokenDecimal;
    this.rewardTokenAddress = rewardTokenAddress;
    this.rewardTokenSymbol = rewardTokenSymbol;
    this.rewardTokenDecimal = rewardTokenDecimal;
    this.stakeContractAddress = stakeContractAddress;
    this.status = status;
    this.order = order;
    this.isFrozen = isFrozen;
  }
}