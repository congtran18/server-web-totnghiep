import {Controller, Get, HttpStatus, Param, Put, Query} from '@nestjs/common';
import {AppService} from './app.service';
import {BaseResponse} from "../utils/base.response";
import {ApiNotAcceptableResponse, ApiOkResponse, ApiOperation, ApiTags} from "@nestjs/swagger";
import {ApiImplicitQuery} from "@nestjs/swagger/dist/decorators/api-implicit-query.decorator";
import {ExplorerInfoDto} from "./dto/explorer-info.dto";

@ApiTags('app')
@Controller('app')
export class AppController {
  constructor(
    private readonly appService: AppService,
  ) {
  }

  @ApiOkResponse({
    description: 'Project info',
    type: ExplorerInfoDto,
  })
  @ApiImplicitQuery({name: 'chainId', required: false, description: '0x1, 0x3, 0x38, 0x61, 0xa86a, 0xa869'})
  @ApiOperation({summary: 'Get project info'})
  @Get('explorer/info')
  async getExplorerProjectInfo(
    @Query('chainId') chainId: string,
  ): Promise<BaseResponse<ExplorerInfoDto | null>> {
    const response: BaseResponse<ExplorerInfoDto | null> = {}
    return response;
  }
}
