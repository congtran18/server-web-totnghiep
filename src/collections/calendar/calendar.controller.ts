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
import { CreateCalendarDto } from './dto/create-calendar.dto';
import { UpdateCalendarDto } from './dto/update-calendar.dto';
import { Calendar } from './schemas/calendar.schema';
import { CalendarService } from './calendar.service';
import { ROLE_OWNER, ROLE_ADMIN, ROLE_TUTOR } from "../admins/dto/admin.roles";

@ApiTags('calendar')
@Controller('calendar')
export class CalendarController {
  private logger: Logger = new Logger(CalendarController.name);

  constructor(private readonly calendarService: CalendarService) { }

  @ApiOkResponse({
    description: 'Create calendar',
    type: Calendar,
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create calendar' })
  @Post()
  @RolesAllowed(ROLE_OWNER, ROLE_ADMIN, ROLE_TUTOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async createCalendar(
    @Body() createCalendartDto: CreateCalendarDto,
    // @AuthJwt() payload: JwtPayload,
  ): Promise<BaseResponse<Model<Calendar>>> {
    const response: BaseResponse<Model<Calendar>> = {};
    const calendar = await this.calendarService.createCalendar(createCalendartDto);
    if (!calendar) {
      response.error = {
        code: HttpStatus.BAD_REQUEST,
        message: 'Lịch bị trùng!',
      };
    } else {
      response.data = calendar;
    }
    return response;
  }

  @ApiOkResponse({
    description: 'Update calendar',
    type: Calendar,
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update calendar' })
  @Patch(':id')
  @RolesAllowed(ROLE_OWNER, ROLE_ADMIN, ROLE_TUTOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async updateCalendar(
    @Param('id') id: string,
    @Body() updateCalendartDto: UpdateCalendarDto,
    // @AuthJwt() payload: JwtPayload,
  ): Promise<BaseResponse<Model<Calendar>>> {
    const response: BaseResponse<Model<Calendar>> = {};

    const calendar = await this.calendarService.updateCalendar(id, updateCalendartDto);
    if (!calendar) {
      response.error = {
        code: HttpStatus.BAD_REQUEST,
        message: 'Lịch bị trùng!',
      };
    } else {
      response.data = calendar;
    }
    return response;
  }

  @ApiOkResponse({
    description: 'Get all calendar',
    type: Calendar,
  })
  // @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all calendar' })
  @Get()
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  // @UseGuards(JwtAuthGuard, RolesGuard)
  async getAllCalendar(
    // @AuthJwt() payload: JwtPayload,
    @Query('page') page: string,
    @Query('limit') limit: string,
  ): Promise<BaseResponse<Calendar>> {
    const response: BaseResponse<Calendar> = {};
    const calendar = await this.calendarService.getAllCalendar(page, limit);
    if (!calendar) {
      response.error = {
        code: HttpStatus.BAD_REQUEST,
        message: 'ERROR.',
      };
    } else {
      response.data = calendar
    }
    return response;
  }


  @ApiOkResponse({
    description: 'Get tutor calendar',
    type: Calendar,
  })
  // @ApiBearerAuth()
  @ApiOperation({ summary: 'Get tutor calendar' })
  @Get(':id')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  async getCalendarByTutorId(
    @Param('id') params: string,
    @AuthJwt() payload: JwtPayload,
  ): Promise<BaseResponse<Calendar>> {
    const response: BaseResponse<Calendar> = {};
    const calendar = await this.calendarService.getCalendarByTutorId(params);
    if (!calendar) {
      response.error = {
        code: HttpStatus.BAD_REQUEST,
        message: 'ERROR.',
      };
    } else {
      response.data = calendar;
    }
    return response;
  }

  @ApiOkResponse({
    description: 'Remove calendar',
    type: Calendar,
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove calendar' })
  @Delete(':id')
  @RolesAllowed(ROLE_OWNER, ROLE_ADMIN, ROLE_TUTOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async removeCalendar(
    @Param('id') params: string,
    // @AuthJwt() payload: JwtPayload,
  ): Promise<any> {
    const response: BaseResponse<any> = {};
    const resultDelete = await this.calendarService.removeCalendar(params);
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
