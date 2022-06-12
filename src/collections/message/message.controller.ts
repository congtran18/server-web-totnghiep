import { User } from "src/collections/users/schemas/user.schema";
import { Message } from "src/collections/message/schemas/message.schema";
import { Body, Controller, Delete, Get, HttpStatus, Logger, Param, Post, Put, Query, UseGuards, Req } from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
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

@ApiTags('message')
@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) { }

  @ApiCreatedResponse({
    description: 'Message info',
    type: Message,
  })
  @ApiBody({ type: CreateMessageDto })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create message' })
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  create(@AuthJwt() payload: JwtPayload, @Body() createMessageDto: CreateMessageDto) {
    createMessageDto.from = payload.uid;
    return this.messageService.create(createMessageDto);
  }

  @ApiOkResponse({
    description: 'List of message',
    type: [Message],
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Messages' })
  @Get(':targetUser')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async findMessages(
    @AuthJwt() payload: JwtPayload,
    @Param('targetUser') targetUser: string,
  ): Promise<any> {
    await this.messageService.updateUnread(targetUser, payload.uid)
    return this.messageService.findAll({
      $or: [
        { from: targetUser, to: payload.uid },
        { from: payload.uid, to: targetUser },
      ],
    });
  }

  @ApiOkResponse({
    description: 'List of unread message',
    type: [Message],
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Unread Messages' })
  @Get('/check/unread')
  @UseGuards(JwtAuthGuard, RolesGuard)
  findUnreadMessages(
    @AuthJwt() payload: JwtPayload,
  ): Promise<any> {
    console.log(" payload.uid", payload.uid)
    return this.messageService.countUnread({
      $or: [
        { read: false, to: payload.uid },
        // { from: payload.uid, to: targetUser },
      ],
    });
  }

  // @ApiOkResponse({
  //   description: 'List of message',
  //   type: [Message],
  // })
  // @ApiBearerAuth()
  // @ApiOperation({ summary: 'Get all Messages of User' })
  // @Get()
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // findAllMessages(
  //   @AuthJwt() payload: JwtPayload,
  //   // @Param('targetUser') targetUser: string,
  // ): Promise<any> {
  //   return this.messageService.findAll({
  //     $or: [
  //       { to: payload.uid },
  //       { from: payload.uid },
  //     ],
  //   });
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.messageService.remove(id);
  }
}
