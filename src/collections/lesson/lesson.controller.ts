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
import { RolesAllowed } from '../auth/roles.decorator'
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { Lesson } from './schemas/lesson.schema';
import { LessonService } from './lesson.service';
import { ROLE_OWNER, ROLE_ADMIN, ROLE_TUTOR } from "../admins/dto/admin.roles";

@ApiTags('lesson')
@Controller('lesson')
export class LessonController {
  private logger: Logger = new Logger(LessonController.name);

  constructor(private readonly lessonService: LessonService) { }

  @ApiOkResponse({
    description: 'Create lesson',
    type: Lesson,
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create lesson' })
  @Post()
  // @RolesAllowed(ROLE_OWNER, ROLE_ADMIN, ROLE_TUTOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async createLesson(
    @Body() createLessontDto: CreateLessonDto,
    // @AuthJwt() payload: JwtPayload,
  ): Promise<BaseResponse<Model<Lesson>>> {
    const response: BaseResponse<Model<Lesson>> = {};
    const lesson = await this.lessonService.createLesson(createLessontDto);
    if (!lesson) {
      response.error = {
        code: HttpStatus.BAD_REQUEST,
        message: 'Lịch bị trùng!',
      };
    } else {
      response.data = lesson;
    }
    return response;
  }

  @ApiOkResponse({
    description: 'Update lesson',
    type: Lesson,
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update lesson' })
  @Patch(':id')
  @RolesAllowed(ROLE_OWNER, ROLE_ADMIN, ROLE_TUTOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async updateLesson(
    @Param('id') id: string,
    @Body() updateLessontDto: UpdateLessonDto,
    // @AuthJwt() payload: JwtPayload,
  ): Promise<BaseResponse<Model<Lesson>>> {
    const response: BaseResponse<Model<Lesson>> = {};

    const lesson = await this.lessonService.updateLesson(id, updateLessontDto);
    if (!lesson) {
      response.error = {
        code: HttpStatus.BAD_REQUEST,
        message: 'Lịch bị trùng!',
      };
    } else {
      response.data = lesson;
    }
    return response;
  }

  @ApiOkResponse({
    description: 'Get all lesson',
    type: Lesson,
  })
  // @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all lesson' })
  @Get()
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  // @UseGuards(JwtAuthGuard, RolesGuard)
  async getAllLesson(
    // @AuthJwt() payload: JwtPayload,
    @Query('page') page: string,
    @Query('limit') limit: string,
  ): Promise<BaseResponse<Lesson>> {
    const response: BaseResponse<Lesson> = {};
    const lesson = await this.lessonService.getAllLesson(page, limit);
    if (!lesson) {
      response.error = {
        code: HttpStatus.BAD_REQUEST,
        message: 'ERROR.',
      };
    } else {
      response.data = lesson
    }
    return response;
  }


  @ApiOkResponse({
    description: 'Get tutor lesson',
    type: Lesson,
  })
  // @ApiBearerAuth()
  @ApiOperation({ summary: 'Get tutor lesson' })
  @Get(':id')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  async getLessonById(
    @Param('id') params: string,
    @AuthJwt() payload: JwtPayload,
  ): Promise<BaseResponse<Lesson>> {
    const response: BaseResponse<Lesson> = {};
    const lesson = await this.lessonService.getLessonById(params);
    if (!lesson) {
      response.error = {
        code: HttpStatus.BAD_REQUEST,
        message: 'ERROR.',
      };
    } else {
      response.data = lesson;
    }
    return response;
  }

  @ApiOkResponse({
    description: 'Remove lesson',
    type: Lesson,
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove lesson' })
  @Delete(':id')
  @RolesAllowed(ROLE_OWNER, ROLE_ADMIN, ROLE_TUTOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async removeLesson(
    @Param('id') params: string,
    // @AuthJwt() payload: JwtPayload,
  ): Promise<any> {
    const response: BaseResponse<any> = {};
    const resultDelete = await this.lessonService.removeLesson(params);
    if (!resultDelete) {
      response.error = {
        code: HttpStatus.NOT_ACCEPTABLE,
        message: 'Không được xóa lịch trong quá khứ',
      }
    } else {
      response.data = resultDelete;
    }
    return response;
  }
}
