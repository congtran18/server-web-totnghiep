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
  Patch,
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
import { CreateVideocallDto } from './dto/create-videocall.dto';
import { Videocall } from './schemas/videocall.schema';
import { VideocallService } from './videocall.service';

@ApiTags('videocall')
@Controller('videocall')
export class VideocallController {
  private logger: Logger = new Logger(VideocallController.name);

  constructor(private readonly videocallService: VideocallService) { }

  @ApiOkResponse({
    description: 'Create videocall',
    type: Videocall,
  })
  // @ApiBearerAuth()
  @ApiOperation({ summary: 'Create videocall' })
  @Post()
  // @UseGuards(JwtAuthGuard, RolesGuard)
  async createVideocall(
    @Body() createVideocalltDto: CreateVideocallDto,
    // @AuthJwt() payload: JwtPayload,
  ): Promise<BaseResponse<Model<Videocall>>> {
    const response: BaseResponse<Model<Videocall>> = {};
    const videocall = await this.videocallService.createVideocall(createVideocalltDto);
    if (!videocall) {
      response.error = {
        code: HttpStatus.BAD_REQUEST,
        message: 'ERROR.',
      };
    } else {
      response.data = videocall;
    }
    return response;
  }


  @ApiOkResponse({
    description: 'Get all videocall',
    type: Videocall,
  })
  // @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all videocall' })
  @Get(':uid')
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'realname', required: false })
  @ApiQuery({ name: 'sort', required: false })
  // @UseGuards(JwtAuthGuard, RolesGuard)
  async getAllVideocall(
    // @AuthJwt() payload: JwtPayload,
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('realname') realname: string,
    @Query('sort') sort: string,
    @Param('uid') uid: string,
  ): Promise<BaseResponse<Videocall>> {
    const response: BaseResponse<Videocall> = {};
    const videocall = await this.videocallService.getAllVideocall(page, limit, realname, sort, uid);
    if (!videocall) {
      response.error = {
        code: HttpStatus.BAD_REQUEST,
        message: 'ERROR.',
      };
    } else {
      response.data = videocall
    }
    return response;
  }

  @ApiOkResponse({
    description: 'Get single videocall',
    type: Videocall,
  })
  // @ApiBearerAuth()
  @ApiOperation({ summary: 'Get single videocall' })
  @Get(':id')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  async getVideocallById(
    @Param('id') params: string,
    // @AuthJwt() payload: JwtPayload,
  ): Promise<BaseResponse<Videocall>> {
    const response: BaseResponse<Videocall> = {};
    const videocall = await this.videocallService.getVideocallById(params);
    if (!videocall) {
      response.error = {
        code: HttpStatus.BAD_REQUEST,
        message: 'ERROR.',
      };
    } else {
      response.data = videocall;
    }
    return response;
  }

  @ApiOkResponse({
    description: 'Check called',
    type: Videocall,
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Check called' })
  @Get('/check-called/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async checkExistVideocall(
    @AuthJwt() payload: JwtPayload,
    @Param('targetUser') targetUser: string,
  ): Promise<any> {
    const response: BaseResponse<any> = {};
    try {
      console.log("payload.uid nek", payload.uid)
      const result = await this.videocallService.checkExistVideocall(targetUser, payload.uid);
      return result;
    } catch (error) {
      response.error = {
        code: HttpStatus.NOT_ACCEPTABLE,
        message: 'Something is missing',
      };
      return response;
    }
  }

  @ApiOkResponse({
    description: 'Remove videocall',
    type: Videocall,
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove videocall' })
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async removeVideocall(
    @Param('id') params: string,
    // @AuthJwt() payload: JwtPayload,
  ): Promise<any> {
    const response: BaseResponse<any> = {};
    try {
      const result = await this.videocallService.removeVideocall(params);
      return result;
    } catch (error) {
      response.error = {
        code: HttpStatus.NOT_ACCEPTABLE,
        message: 'Something is missing',
      };
      return response;
    }
  }
  
}