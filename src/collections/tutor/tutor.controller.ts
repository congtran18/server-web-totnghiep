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
import { CreateTutorDto } from './dto/create-tutor.dto';
import { UpdateTutorDto } from './dto/update-tutor.dto';
import { Tutor } from './schemas/tutor.schema';
import { TutorService } from './tutor.service';
import { ROLE_OWNER, ROLE_ADMIN } from "../admins/dto/admin.roles";

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
    console.log("createTutortDto", createTutortDto)
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
  @RolesAllowed(ROLE_OWNER, ROLE_ADMIN)
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
  @ApiQuery({ name: 'realname', required: false })
  @ApiQuery({ name: 'sort', required: false })
  @ApiQuery({ name: 'accept', required: false })
  // @UseGuards(JwtAuthGuard, RolesGuard)
  async getAllTutor(
    // @AuthJwt() payload: JwtPayload,
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('status') status: string,
    @Query('warning') warning: string,
    @Query('realname') realname: string,
    @Query('sort') sort: string,
    @Query('accept') accept: string,
  ): Promise<BaseResponse<Tutor>> {
    const response: BaseResponse<Tutor> = {};
    const tutor = await this.tutorService.getAllTutor(page, limit, status, warning, realname, sort, accept);
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
    description: 'Get all restore tutor',
    type: Tutor,
  })
  // @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all restore tutor' })
  @Get("/restore")
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'type', required: false })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'realname', required: false })
  async getAllRestoreTutor(
    // @AuthJwt() payload: JwtPayload,
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('type') type: string,
    @Query('category') category: string,
    @Query('realname') realname: string,
  ): Promise<BaseResponse<Tutor>> {
    const response: BaseResponse<Tutor> = {};
    const tutor = await this.tutorService.getAllRestoreTutor(page, limit, type, category, realname);
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