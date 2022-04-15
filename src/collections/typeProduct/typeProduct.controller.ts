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
import { CreateTypeProductDto } from './dto/create-typeProduct.dto';
import { UpdateTypeProductDto } from './dto/update-typeProduct.dto';
import { TypeProduct } from './schemas/typeProduct.schema';
import { TypeProductService } from './typeProduct.service';

@ApiTags('type product')
@Controller('typeProduct')
export class TypeProductController {
  private logger: Logger = new Logger(TypeProductController.name);

  constructor(private readonly typeProductService: TypeProductService) { }

  @ApiOkResponse({
    description: 'Create type product',
    type: TypeProduct,
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create type product' })
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  async createTypeProduct(
    @Body() createTypeProducttDto: CreateTypeProductDto,
    // @AuthJwt() payload: JwtPayload,
  ): Promise<BaseResponse<Model<TypeProduct>>> {
    const response: BaseResponse<Model<TypeProduct>> = {};
    const typeProduct = await this.typeProductService.createTypeProduct(createTypeProducttDto);
    if (!typeProduct) {
      response.error = {
        code: HttpStatus.BAD_REQUEST,
        message: 'ERROR.',
      };
    } else {
      response.data = typeProduct;
    }
    return response;
  }

  @ApiOkResponse({
    description: 'Update type product',
    type: TypeProduct,
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update product' })
  @Put()
  @UseGuards(JwtAuthGuard, RolesGuard)
  async updateTypeProduct(
    @Body() updateTypeProducttDto: UpdateTypeProductDto,
    // @AuthJwt() payload: JwtPayload,
  ): Promise<BaseResponse<Model<TypeProduct>>> {
    const response: BaseResponse<Model<TypeProduct>> = {};
    const typeProduct = await this.typeProductService.updateTypeProduct(updateTypeProducttDto);
    if (!typeProduct) {
      response.error = {
        code: HttpStatus.BAD_REQUEST,
        message: 'ERROR.',
      };
    } else {
      response.data = typeProduct;
    }
    return response;
  }

  @ApiOkResponse({
    description: 'Get all type product',
    type: TypeProduct,
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all product' })
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getAllTypeProduct(
    // @AuthJwt() payload: JwtPayload,
    // @Query('page') page: string,
    // @Query('limit') limit: string,
  ): Promise<BaseResponse<TypeProduct>> {
    const response: BaseResponse<TypeProduct> = {};
    const typeProduct = await this.typeProductService.getAllTypeProduct();
    if (!typeProduct) {
      response.error = {
        code: HttpStatus.BAD_REQUEST,
        message: 'ERROR.',
      };
    } else {
      response.data = typeProduct
    }
    return response;
  }

  @ApiOkResponse({
    description: 'Get single type product',
    type: TypeProduct,
  })
  // @ApiBearerAuth()
  @ApiOperation({ summary: 'Get single product' })
  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getTypeProductById(
    @Param('id') params: string,
    @AuthJwt() payload: JwtPayload, 
  ): Promise<BaseResponse<TypeProduct>> {
    const response: BaseResponse<TypeProduct> = {};
    const typeProduct = await this.typeProductService.getTypeProductById(params);
    if (!typeProduct) {
      response.error = {
        code: HttpStatus.BAD_REQUEST,
        message: 'ERROR.',
      };
    } else {
      response.data = typeProduct;
    }
    return response;
  }

  @ApiOkResponse({
    description: 'Delete type product',
    type: TypeProduct,
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete type product' })
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async deleteTypeProduct(
    @Param('id') params: string,
    // @AuthJwt() payload: JwtPayload,
  ): Promise<BaseResponse<TypeProduct>> {
    const response: BaseResponse<TypeProduct> = {};
    const typeProduct = await this.typeProductService.deleteTypeProduct(params);
    if (!typeProduct) {
      response.error = {
        code: HttpStatus.BAD_REQUEST,
        message: 'ERROR.',
      };
    } else {
      response.data = typeProduct;
    }
    return response;
  }
}