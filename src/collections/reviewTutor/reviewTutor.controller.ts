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
  create(@AuthJwt() payload: JwtPayload, @Body() createMessageDto: CreateReviewTutorDto) {
    const response: any = {};
    createMessageDto.from = payload.uid;
    
    const reviewCreate = this.reviewTutorService.create(createMessageDto);

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

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reviewTutorService.remove(id);
  }
}
