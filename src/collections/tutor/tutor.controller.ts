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
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiQuery
} from "@nestjs/swagger";
import { Model } from 'mongoose';
import { BaseResponse } from '../../utils/base.response';
import { AuthJwt } from '../auth/auth.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { JwtPayload } from '../auth/jwt.payload';
import { RolesGuard } from '../auth/roles.guard';
import { RolesAllowed } from '../auth/roles.decorator'
import { CreateTutorDto } from './dto/create-tutor.dto';
import { UpdateTutorDto } from './dto/update-tutor.dto';
import { Tutor } from './schemas/tutor.schema';
import { TutorService } from './tutor.service';
import { ROLE_OWNER, ROLE_ADMIN, ROLE_TUTOR } from "../admins/dto/admin.roles";
import { UpdateTutorMinutesDto } from "./dto/update-minutes.dto";

@ApiTags('tutor')
@Controller('tutor')
export class TutorController {
  private logger: Logger = new Logger(TutorController.name);

  constructor(private readonly tutorService: TutorService) { }

  @ApiOkResponse({
    description: 'Create tutor',
    type: Tutor,
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create tutor' })
  @Post()
  // @RolesAllowed(ROLE_OWNER,ROLE_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async createTutor(
    @Body() createTutortDto: CreateTutorDto,
    // @AuthJwt() payload: JwtPayload,
  ): Promise<BaseResponse<Model<Tutor>>> {
    const response: BaseResponse<Model<Tutor>> = {};
    const tutor = await this.tutorService.createTutor(createTutortDto);
    if (!tutor) {
      response.error = {
        code: HttpStatus.BAD_REQUEST,
        message: 'Có lỗi khi đăng ký!',
      };
    } else {
      response.data = tutor;
    }
    return response;
  }

  @ApiOkResponse({
    description: 'Update tutor',
    type: Tutor,
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update tutor' })
  @Patch(':id')
  @RolesAllowed(ROLE_OWNER, ROLE_ADMIN, ROLE_TUTOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async updateTutor(
    @Param('id') id: string,
    @Body() updateTutortDto: UpdateTutorDto,
    // @AuthJwt() payload: JwtPayload,
  ): Promise<BaseResponse<Model<Tutor>>> {
    const response: BaseResponse<Model<Tutor>> = {};

    const tutor = await this.tutorService.updateTutor(id, updateTutortDto);
    if (!tutor) {
      response.error = {
        code: HttpStatus.BAD_REQUEST,
        message: 'ERROR.',
      };
    } else {
      response.data = tutor;
    }
    return response;
  }

  @ApiOkResponse({
    description: 'Get all tutor',
    type: Tutor,
  })
  // @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all tutor' })
  @Get()
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'warning', required: false })
  @ApiQuery({ name: 'fullName', required: false })
  @ApiQuery({ name: 'sort', required: false })
  @ApiQuery({ name: 'accept', required: false })
  // @UseGuards(JwtAuthGuard, RolesGuard)
  async getAllTutor(
    // @AuthJwt() payload: JwtPayload,
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('status') status: string,
    @Query('warning') warning: string,
    @Query('fullName') fullName: string,
    @Query('sort') sort: string,
    @Query('accept') accept: string,
  ): Promise<BaseResponse<Tutor>> {
    const response: BaseResponse<Tutor> = {};
    const tutor = await this.tutorService.getAllTutor(page, limit, status, warning, fullName, sort, accept);
    if (!tutor) {
      response.error = {
        code: HttpStatus.BAD_REQUEST,
        message: 'ERROR.',
      };
    } else {
      response.data = tutor
    }
    return response;
  }

  @ApiOkResponse({
    description: 'Get single tutor',
    type: Tutor,
  })
  // @ApiBearerAuth()
  @ApiOperation({ summary: 'Get single tutor' })
  @Get(':id')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  async getTutorById(
    @Param('id') params: string,
    // @AuthJwt() payload: JwtPayload,
  ): Promise<BaseResponse<Tutor>> {
    const response: BaseResponse<Tutor> = {};
    const tutor = await this.tutorService.getTutorById(params);
    if (!tutor) {
      response.error = {
        code: HttpStatus.BAD_REQUEST,
        message: 'ERROR.',
      };
    } else {
      response.data = tutor;
    }
    return response;
  }

  @ApiOkResponse({
    description: 'Accept tutor',
    type: Tutor,
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Accept tutor' })
  @Get('/accept/:id')
  @RolesAllowed(ROLE_OWNER, ROLE_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async acceptTutor(
    @Param('id') params: string,
    // @AuthJwt() payload: JwtPayload,
  ): Promise<any> {
    const response: BaseResponse<any> = {};
    const tutor = await this.tutorService.acceptTutor(params);
    if (!tutor) {
      response.error = {
        code: HttpStatus.BAD_REQUEST,
        message: 'ERROR.',
      };
    } else {
      response.data = tutor;
    }
    return response;
  }


  @ApiOkResponse({
    description: 'User info',
    type: Tutor,
  })
  @ApiBody({ type: UpdateTutorMinutesDto })
  // @ApiBearerAuth()
  @ApiOperation({ summary: 'Update minutes left' })
  @Patch('/update-tutor-minutes/:id')
  // @UseGuards(JwtAuthGuard)
  async updateMinutesLeft(@Param('id') id: string, @Body() updateTutorMinutesDto: UpdateTutorMinutesDto): Promise<BaseResponse<Tutor | null>> {
    const response: BaseResponse<any> = {};

    // Username is available
    try {
      const user = await this.tutorService.updateTutorMinutesCall(id, parseInt(updateTutorMinutesDto.value));
      response.data = user;
    } catch {
      response.error = {
        code: HttpStatus.NOT_ACCEPTABLE,
        message: "tutor is not available."
      }
    }

    return response;
  }

  @ApiOkResponse({
    description: 'Delete tutor',
    type: Tutor,
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete tutor' })
  @Get('/track/:id')
  @RolesAllowed(ROLE_OWNER, ROLE_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async deleteTutor(
    @Param('id') params: string,
    // @AuthJwt() payload: JwtPayload,
  ): Promise<any> {
    const response: BaseResponse<any> = {};
    const tutor = await this.tutorService.deleteTutor(params);
    if (!tutor) {
      response.error = {
        code: HttpStatus.BAD_REQUEST,
        message: 'ERROR.',
      };
    } else {
      response.data = tutor;
    }
    return response;
  }

  @ApiOkResponse({
    description: 'Remove tutor',
    type: Tutor,
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove tutor' })
  @Delete(':id')
  @RolesAllowed(ROLE_OWNER, ROLE_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async removeTutor(
    @Param('id') params: string,
    // @AuthJwt() payload: JwtPayload,
  ): Promise<any> {
    const response: BaseResponse<any> = {};
    try {
      const result = await this.tutorService.removeTutor(params);
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