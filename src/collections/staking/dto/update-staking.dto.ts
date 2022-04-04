import { ApiProperty } from '@nestjs/swagger';

export class UpdateStakingtDto {

  @ApiProperty()
  _id: string;

  @ApiProperty()
  network: string;

  @ApiProperty()
  poolTitle: string;

  @ApiProperty()
  coinSymbol: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  mainCoinImage: string;

  @ApiProperty()
  smallCoinImage: string;

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

  constructor(
    _id: string,
    network: string,
    poolTitle: string,
    coinSymbol: string,
    description: string,
    mainCoinImage: string,
    smallCoinImage: string,
    stakeTokenSymbol: string,
    stakeTokenDecimal: number,
    rewardTokenAddress: string,
    stakeTokenAddress: string,
    rewardTokenSymbol: string,
    rewardTokenDecimal: number,
    stakeContractAddress: string,
    status: string,
    order: number,
  ) {
    this._id = _id;
    this.network = network;
    this.poolTitle = poolTitle;
    this.coinSymbol = coinSymbol;
    this.description = description;
    this.mainCoinImage = mainCoinImage;
    this.smallCoinImage = smallCoinImage;
    this.stakeTokenAddress = stakeTokenAddress;
    this.stakeTokenSymbol = stakeTokenSymbol;
    this.stakeTokenDecimal = stakeTokenDecimal;
    this.rewardTokenAddress = rewardTokenAddress;
    this.rewardTokenSymbol = rewardTokenSymbol;
    this.rewardTokenDecimal = rewardTokenDecimal;
    this.stakeContractAddress = stakeContractAddress;
    this.status = status;
    this.order = order;
  }
}