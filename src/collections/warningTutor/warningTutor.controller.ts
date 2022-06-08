import { User } from "src/collections/users/schemas/user.schema";
import { WarningTutor } from "src/collections/warningTutor/schemas/warningTutor.schema";
import { Body, Controller, Delete, Get, HttpStatus, Logger, Param, Post, Put, Query, UseGuards, Req, Patch } from '@nestjs/common';
import { WarningTutorService } from './warningTutor.service';
import { CreateWarningTutorDto } from './dto/create-warningTutor.dto';
import { UpdateWarningTutorDto } from './dto/update-warningTutor.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthJwt } from "../auth/auth.decorator";
import { JwtPayload } from "../auth/jwt.payload";
import { RolesGuard } from '../auth/roles.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotAcceptableResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiQuery
} from "@nestjs/swagger";

@ApiTags('warningTutor')
@Controller('warningTutor')
export class WarningTutorController {
  constructor(private readonly warningTutorService: WarningTutorService) { }

  @ApiCreatedResponse({
    description: 'WarningTutor info',
    type: WarningTutor,
  })
  @ApiBody({ type: CreateWarningTutorDto })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create warningTutor' })
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  create(@AuthJwt() payload: JwtPayload, @Body() createMessageDto: CreateWarningTutorDto) {
    const response: any = {};
    createMessageDto.from = payload.uid;
    
    const reviewCreate = this.warningTutorService.create(createMessageDto);

    if (!reviewCreate) {
      response.error = {
        code: HttpStatus.BAD_REQUEST,
        message: 'Bạn đã đánh giá gia sư này rồi',
      };
    } else {
      response.data = reviewCreate;
    }
    return response;
  }

  @ApiOkResponse({
    description: 'List of warningTutor',
    type: [WarningTutor],
  })
  @ApiOperation({ summary: 'Get WarningTutors' })
  @Get(':targetUser')
  findWarningTutors(
    @AuthJwt() payload: JwtPayload,
    @Param('targetUser') targetUser: string,
  ): Promise<any> {
    return this.warningTutorService.findAll({
      $or: [
        { to: targetUser },
        // { from: payload.uid, to: targetUser },
      ],
    });
  }

  @ApiOkResponse({
    description: 'Update WarningTutor',
    type: WarningTutor,
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update WarningTutor' })
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async updateTutor(
    @Param('id') id: string,
    @Body() updateTutortDto: UpdateWarningTutorDto,
    // @AuthJwt() payload: JwtPayload,
  ): Promise<any> {
    const response: any = {};

    const review = await this.warningTutorService.update(id, updateTutortDto);
    if (!review) {
      response.error = {
        code: HttpStatus.BAD_REQUEST,
        message: 'Lỗi khi cập nhật review',
      };
    } else {
      response.data = review;
    }
    return response;
  }

  // @ApiOkResponse({
  //   description: 'List of warningTutor',
  //   type: [WarningTutor],
  // })
  // @ApiBearerAuth()
  // @ApiOperation({ summary: 'Get all WarningTutors of User' })
  // @Get()
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // findAllWarningTutors(
  //   @AuthJwt() payload: JwtPayload,
  //   // @Param('targetUser') targetUser: string,
  // ): Promise<any> {
  //   return this.warningTutorService.findAll({
  //     $or: [
  //       { to: payload.uid },
  //       { from: payload.uid },
  //     ],
  //   });
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.warningTutorService.remove(id);
  }
}
