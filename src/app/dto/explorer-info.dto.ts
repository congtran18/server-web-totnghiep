import {IsNotEmpty} from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";

export class ExplorerInfoDto {

  @IsNotEmpty()
  @ApiProperty()
  totalLockedTokenUsd: number;

  @IsNotEmpty()
  @ApiProperty()
  totalLiquidityTokenUsd: number;

  @IsNotEmpty()
  @ApiProperty()
  totalProjectLocked: number;

  constructor(totalLockedTokenUsd: number, totalLiquidityTokenUsd: number, totalProjectLocked: number) {
    this.totalLockedTokenUsd = totalLockedTokenUsd;
    this.totalLiquidityTokenUsd = totalLiquidityTokenUsd;
    this.totalProjectLocked = totalProjectLocked;
  }
}
