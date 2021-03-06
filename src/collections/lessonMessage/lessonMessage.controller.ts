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
import { CreateLessonMessageDto } from './dto/create-lesson-message.dto';
import { LessonMessage } from './schemas/lessonMessage.schema';
import { LessonMessageService } from './lessonMessage.service';
import { AdminsService } from "../admins/admins.service";

@ApiTags('lessonMessage')
@Controller('lessonMessage')
export class LessonMessageController {
  private logger: Logger = new Logger(LessonMessageController.name);

  constructor(
    private readonly lessonMessageService: LessonMessageService,
    private readonly adminsService: AdminsService,
  ) { }

  @ApiOkResponse({
    description: 'Create lessonMessage',
    type: LessonMessage,
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create lessonMessage' })
  @Post()
  // @RolesAllowed(ROLE_OWNER, ROLE_ADMIN, ROLE_TUTOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async createLessonMessage(
    @Body() createLessonMessagetDto: CreateLessonMessageDto,
    // @AuthJwt() payload: JwtPayload,
  ): Promise<BaseResponse<Model<LessonMessage>>> {
    const response: BaseResponse<Model<LessonMessage>> = {};
    const lessonMessage = await this.lessonMessageService.createLessonMessage(createLessonMessagetDto);
    if (!lessonMessage) {
      response.error = {
        code: HttpStatus.BAD_REQUEST,
        message: 'Lỗi khi tạo lesson message!',
      };
    } else {
      response.data = lessonMessage;
    }
    return response;
  }

  @ApiOkResponse({
    description: 'Get all lessonMessage',
    type: LessonMessage,
  })
  // @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all lessonMessage' })
  @Get(':uid')
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  // @UseGuards(JwtAuthGuard, RolesGuard)
  async getAllLessonMessage(
    // @AuthJwt() payload: JwtPayload,
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Param('uid') uid: string,
  ): Promise<BaseResponse<LessonMessage>> {
    const response: BaseResponse<LessonMessage> = {};
    await this.lessonMessageService.updateUnread(uid)
    const checkRole = await this.adminsService.getAdmin(uid)
    const lessonMessage = await this.lessonMessageService.getAllLessonMessage(page, limit, uid, checkRole?.role);
    if (!lessonMessage) {
      response.error = {
        code: HttpStatus.BAD_REQUEST,
        message: 'ERROR.',
      };
    } else {
      response.data = lessonMessage
    }
    return response;
  }

  @ApiOkResponse({
    description: 'Get all lessonMessageCount',
    type: LessonMessage,
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all lessonMessageCount' })
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getCountLessonMessage(
    @AuthJwt() payload: JwtPayload,
  ): Promise<BaseResponse<LessonMessage>> {
    const response: BaseResponse<LessonMessage> = {};
    const lessonMessageCount = await this.lessonMessageService.countUnread(payload.uid);
    if (!lessonMessageCount) {
      response.error = {
        code: HttpStatus.BAD_REQUEST,
        message: 'ERROR.',
      };
    } else {
      response.data = lessonMessageCount
    }
    return response;
  }
}
