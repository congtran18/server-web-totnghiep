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
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './schemas/order.schema';
import { OrderService } from './order.service';

@ApiTags('order')
@Controller('order')
export class OrderController {
  private logger: Logger = new Logger(OrderController.name);

  constructor(private readonly orderService: OrderService) { }

  @ApiOkResponse({
    description: 'Create order',
    type: Order,
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create order' })
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  async createOrder(
    @Body() createOrdertDto: any,
    // @AuthJwt() payload: JwtPayload,
  ): Promise<BaseResponse<Model<Order>>> {
    const response: BaseResponse<Model<Order>> = {};
    const order = await this.orderService.createOrder(createOrdertDto);
    if (!order) {
      response.error = {
        code: HttpStatus.BAD_REQUEST,
        message: 'ERROR.',
      };
    } else {
      response.data = order;
    }
    return response;
  }

  @ApiOkResponse({
    description: 'Update order',
    type: Order,
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update order' })
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async updateOrder(
    @Param('id') id: string,
    @Body() updateOrdertDto: UpdateOrderDto,
    // @AuthJwt() payload: JwtPayload,
  ): Promise<BaseResponse<Model<Order>>> {
    const response: BaseResponse<Model<Order>> = {};
    const order = await this.orderService.updateOrder(id, updateOrdertDto);
    if (!order) {
      response.error = {
        code: HttpStatus.BAD_REQUEST,
        message: 'ERROR.',
      };
    } else {
      response.data = order;
    }
    return response;
  }

  @ApiOkResponse({
    description: 'Get all order',
    type: Order,
  })
  // @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all order' })
  @Get()
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'realname', required: false })
  // @UseGuards(JwtAuthGuard, RolesGuard)
  async getAllOrder(
    // @AuthJwt() payload: JwtPayload,
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('realname') realname: string,
  ): Promise<BaseResponse<Order>> {
    const response: BaseResponse<Order> = {};
    const order = await this.orderService.getAllOrder(page, limit, realname);
    if (!order) {
      response.error = {
        code: HttpStatus.BAD_REQUEST,
        message: 'ERROR.',
      };
    } else {
      response.data = order
    }
    return response;
  }

  @ApiOkResponse({
    description: 'Get all restore order',
    type: Order,
  })
  // @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all restore order' })
  @Get("/restore")
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'realname', required: false })
  async getAllRestoreOrder(
    // @AuthJwt() payload: JwtPayload,
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('realname') realname: string,
  ): Promise<BaseResponse<Order>> {
    const response: BaseResponse<Order> = {};
    const order = await this.orderService.getAllRestoreOrder(page, limit, realname);
    if (!order) {
      response.error = {
        code: HttpStatus.BAD_REQUEST,
        message: 'ERROR.',
      };
    } else {
      response.data = order
    }
    return response;
  }

  @ApiOkResponse({
    description: 'Get single order',
    type: Order,
  })
  // @ApiBearerAuth()
  @ApiOperation({ summary: 'Get single order' })
  @Get(':id')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  async getOrderById(
    @Param('id') params: string,
    // @AuthJwt() payload: JwtPayload,
  ): Promise<BaseResponse<Order>> {
    const response: BaseResponse<Order> = {};
    const order = await this.orderService.getOrderById(params);
    if (!order) {
      response.error = {
        code: HttpStatus.BAD_REQUEST,
        message: 'ERROR.',
      };
    } else {
      response.data = order;
    }
    return response;
  }

  @ApiOkResponse({
    description: 'Delete order',
    type: Order,
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete order' })
  @Get('/track/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async deleteOrder(
    @Param('id') params: string,
    // @AuthJwt() payload: JwtPayload,
  ): Promise<any> {
    const response: BaseResponse<any> = {};
    const order = await this.orderService.deleteOrder(params);
    if (!order) {
      response.error = {
        code: HttpStatus.BAD_REQUEST,
        message: 'ERROR.',
      };
    } else {
      response.data = order;
    }
    return response;
  }

  @ApiOkResponse({
    description: 'Remove order',
    type: Order,
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove order' })
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async removeOrder(
    @Param('id') params: string,
    // @AuthJwt() payload: JwtPayload,
  ): Promise<any> {
    const response: BaseResponse<any> = {};
    try {
      const result = await this.orderService.removeOrder(params);
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