import { User } from "src/collections/users/schemas/user.schema";
import { ReviewTutor } from "src/collections/reviewTutor/schemas/reviewTutor.schema";
import { Body, Controller, Delete, Get, HttpStatus, Logger, Param, Post, Put, Query, UseGuards, Req, Patch } from '@nestjs/common';
import { ReviewTutorService } from './reviewTutor.service';
import { CreateReviewTutorDto } from './dto/create-reviewTutor.dto';
import { UpdateReviewTutorDto } from './dto/update-reviewTutor.dto';
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
import { BaseResponse } from '../../utils/base.response';

@ApiTags('reviewTutor')
@Controller('reviewTutor')
export class ReviewTutorController {
  constructor(private readonly reviewTutorService: ReviewTutorService) { }

  @ApiCreatedResponse({
    description: 'ReviewTutor info',
    type: ReviewTutor,
  })
  @ApiBody({ type: CreateReviewTutorDto })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create reviewTutor' })
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  async create(@AuthJwt() payload: JwtPayload, @Body() createMessageDto: CreateReviewTutorDto) {
    const response: any = {};
    createMessageDto.from = payload.uid;

    const reviewCreate = await this.reviewTutorService.create(createMessageDto);

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
    description: 'List of reviewTutor',
    type: [ReviewTutor],
  })
  @ApiOperation({ summary: 'Get ReviewTutors' })
  @Get(':targetUser')
  findReviewTutors(
    @AuthJwt() payload: JwtPayload,
    @Param('targetUser') targetUser: string,
  ): Promise<any> {
    return this.reviewTutorService.findAll({
      $or: [
        { to: targetUser },
        // { from: payload.uid, to: targetUser },
      ],
    });
  }

  @ApiOkResponse({
    description: 'Update ReviewTutor',
    type: ReviewTutor,
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update ReviewTutor' })
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async updateTutor(
    @Param('id') id: string,
    @Body() updateTutortDto: UpdateReviewTutorDto,
    // @AuthJwt() payload: JwtPayload,
  ): Promise<any> {
    const response: any = {};

    const review = await this.reviewTutorService.update(id, updateTutortDto);
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
  //   description: 'List of reviewTutor',
  //   type: [ReviewTutor],
  // })
  // @ApiBearerAuth()
  // @ApiOperation({ summary: 'Get all ReviewTutors of User' })
  // @Get()
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // findAllReviewTutors(
  //   @AuthJwt() payload: JwtPayload,
  //   // @Param('targetUser') targetUser: string,
  // ): Promise<any> {
  //   return this.reviewTutorService.findAll({
  //     $or: [
  //       { to: payload.uid },
  //       { from: payload.uid },
  //     ],
  //   });
  // }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'delete review' })
  @Delete('/delete-review/:targetUser')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async checkExistVideocall(
    @AuthJwt() payload: JwtPayload,
    @Param('targetUser') targetUser: string,
  ): Promise<any> {
    const response: BaseResponse<any> = {};
    try {
      const result = await this.reviewTutorService.removeReview(payload.uid, targetUser);
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
