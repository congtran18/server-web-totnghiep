import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Logger,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Model } from 'mongoose';
import { BaseResponse } from '../../utils/base.response';
import { AuthJwt } from '../auth/auth.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { JwtPayload } from '../auth/jwt.payload';
import { RolesGuard } from '../auth/roles.guard';
import { CreateStakingtDto } from './dto/create-staking.dto';
import { UpdateStakingtDto } from './dto/update-staking.dto';
import { Staking } from './schemas/staking.schema';
import { StakingService } from './staking.service';

@ApiTags('staking')
@Controller('staking')
export class StakingController {
  private logger: Logger = new Logger(StakingController.name);

  constructor(private readonly stakingService: StakingService) { }

  @ApiOkResponse({
    description: 'Create staking',
    type: Staking,
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create staking' })
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  async createStaking(
    @Body() createStakingtDto: CreateStakingtDto,
    // @AuthJwt() payload: JwtPayload,
  ): Promise<BaseResponse<Model<Staking>>> {
    const response: BaseResponse<Model<Staking>> = {};
    const staking = await this.stakingService.createStaking(createStakingtDto);
    if (!staking) {
      response.error = {
        code: HttpStatus.BAD_REQUEST,
        message: 'ERROR.',
      };
    } else {
      response.data = staking;
    }
    return response;
  }

  @ApiOkResponse({
    description: 'Update staking',
    type: Staking,
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update staking' })
  @Put()
  @UseGuards(JwtAuthGuard, RolesGuard)
  async updateStaking(
    @Body() updateStakingtDto: UpdateStakingtDto,
    // @AuthJwt() payload: JwtPayload,
  ): Promise<BaseResponse<Model<Staking>>> {
    const response: BaseResponse<Model<Staking>> = {};
    const staking = await this.stakingService.updateStaking(updateStakingtDto);
    if (!staking) {
      response.error = {
        code: HttpStatus.BAD_REQUEST,
        message: 'ERROR.',
      };
    } else {
      response.data = staking;
    }
    return response;
  }

  @ApiOkResponse({
    description: 'Get all staking',
    type: Staking,
  })
  // @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all staking' })
  @Get()
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  // @UseGuards(JwtAuthGuard, RolesGuard)
  async getAllStaking(
    // @AuthJwt() payload: JwtPayload,
    @Query('page') page: string,
    @Query('limit') limit: string,
  ): Promise<BaseResponse<Staking>> {
    const response: BaseResponse<Staking> = {};
    const staking = await this.stakingService.getAllStaking(page, limit);
    if (!staking) {
      response.error = {
        code: HttpStatus.BAD_REQUEST,
        message: 'ERROR.',
      };
    } else {
      response.data = staking
    }
    return response;
  }

  @ApiOkResponse({
    description: 'Get single staking',
    type: Staking,
  })
  // @ApiBearerAuth()
  @ApiOperation({ summary: 'Get single staking' })
  @Get(':id')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  async getStakingById(
    @Param('id') params: string,
    // @AuthJwt() payload: JwtPayload,
  ): Promise<BaseResponse<Staking>> {
    const response: BaseResponse<Staking> = {};
    const staking = await this.stakingService.getStakingById(params);
    if (!staking) {
      response.error = {
        code: HttpStatus.BAD_REQUEST,
        message: 'ERROR.',
      };
    } else {
      response.data = staking;
    }
    return response;
  }

  @ApiOkResponse({
    description: 'Delete staking',
    type: Staking,
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete staking' })
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async deleteStaking(
    @Param('id') params: string,
    // @AuthJwt() payload: JwtPayload,
  ): Promise<BaseResponse<Staking>> {
    const response: BaseResponse<Staking> = {};
    const staking = await this.stakingService.deleteStaking(params);
    if (!staking) {
      response.error = {
        code: HttpStatus.BAD_REQUEST,
        message: 'ERROR.',
      };
    } else {
      response.data = staking;
    }
    return response;
  }
}