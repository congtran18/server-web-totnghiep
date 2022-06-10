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
import { MailService } from './mail.service';

@ApiTags('mail')
@Controller('mail')
export class MailController {
  private logger: Logger = new Logger(MailController.name);

  constructor(private readonly mailService: MailService) { }

  // @ApiBearerAuth()
  @ApiOperation({ summary: 'Get single mail' })
  @Get()
  // @UseGuards(JwtAuthGuard, RolesGuard)
  async getMailById(
    // @Param('id') params: string,
    // @AuthJwt() payload: JwtPayload,
  ): Promise<void> {

    return this.mailService.sendUserConfirmation("tranvanthanhcooong@gmail.com", "sách");
  }
}