import { User } from "src/collections/users/schemas/user.schema";
import { Message } from "src/packages/message/schemas/message.schema";
import { Body, Controller, Delete, Get, HttpStatus, Logger, Param, Post, Put, Query, UseGuards, Req } from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
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
  @ApiOperation({ summary: 'Create message' })
  @Post()
  create(@Req() { user }: any, @Body() createMessageDto: CreateMessageDto) {
    createMessageDto.from = (user as User).uid;
    return this.messageService.create(createMessageDto);
  }

  @ApiOkResponse({
    description: 'List of user',
    type: [User],
  })
  @Get('history/:targetUser')
  findMessages(
    @Req() { user }: { user: User },
    @Param('targetUser') targetUser: string,
  ) {
    return this.messageService.findAll({
      $or: [
        { from: targetUser, to: user.uid },
        { from: user.uid, to: targetUser },
      ],
    });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.messageService.remove(id);
  }
}