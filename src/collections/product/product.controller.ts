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
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './schemas/product.schema';
import { ProductService } from './product.service';
import { ROLE_OWNER, ROLE_ADMIN } from "../../collections/admins/dto/admin.roles";

@ApiTags('product')
@Controller('product')
export class ProductController {
  private logger: Logger = new Logger(ProductController.name);

  constructor(private readonly productService: ProductService) { }

  @ApiOkResponse({
    description: 'Create product',
    type: Product,
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create product' })
  @Post()
  @RolesAllowed(ROLE_OWNER,ROLE_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async createProduct(
    @Body() createProducttDto: any,
    // @AuthJwt() payload: JwtPayload,
  ): Promise<BaseResponse<Model<Product>>> {
    const response: BaseResponse<Model<Product>> = {};
    const product = await this.productService.createProduct(createProducttDto);
    if (!product) {
      response.error = {
        code: HttpStatus.BAD_REQUEST,
        message: 'Bạn không có quyền!',
      };
    } else {
      response.data = product;
    }
    return response;
  }

  @ApiOkResponse({
    description: 'Update product',
    type: Product,
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update product' })
  @Patch(':id')
  @RolesAllowed(ROLE_OWNER, ROLE_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async updateProduct(
    @Param('id') id: string,
    @Body() updateProducttDto: UpdateProductDto,
    // @AuthJwt() payload: JwtPayload,
  ): Promise<BaseResponse<Model<Product>>> {
    const response: BaseResponse<Model<Product>> = {};
    const product = await this.productService.updateProduct(id, updateProducttDto);
    if (!product) {
      response.error = {
        code: HttpStatus.BAD_REQUEST,
        message: 'ERROR.',
      };
    } else {
      response.data = product;
    }
    return response;
  }

  @ApiOkResponse({
    description: 'Get all product',
    type: Product,
  })
  // @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all product' })
  @Get()
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'type', required: false })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'realname', required: false })
  @ApiQuery({ name: 'sort', required: false })
  // @UseGuards(JwtAuthGuard, RolesGuard)
  async getAllProduct(
    // @AuthJwt() payload: JwtPayload,
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('type') type: string,
    @Query('category') category: string,
    @Query('realname') realname: string,
    @Query('sort') sort: string,
  ): Promise<BaseResponse<Product>> {
    const response: BaseResponse<Product> = {};
    const product = await this.productService.getAllProduct(page, limit, type, category, realname, sort);
    if (!product) {
      response.error = {
        code: HttpStatus.BAD_REQUEST,
        message: 'ERROR.',
      };
    } else {
      response.data = product
    }
    return response;
  }

  @ApiOkResponse({
    description: 'Get all restore product',
    type: Product,
  })
  // @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all restore product' })
  @Get("/restore")
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'type', required: false })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'realname', required: false })
  async getAllRestoreProduct(
    // @AuthJwt() payload: JwtPayload,
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('type') type: string,
    @Query('category') category: string,
    @Query('realname') realname: string,
  ): Promise<BaseResponse<Product>> {
    const response: BaseResponse<Product> = {};
    const product = await this.productService.getAllRestoreProduct(page, limit, type, category, realname);
    if (!product) {
      response.error = {
        code: HttpStatus.BAD_REQUEST,
        message: 'ERROR.',
      };
    } else {
      response.data = product
    }
    return response;
  }

  @ApiOkResponse({
    description: 'Get single product',
    type: Product,
  })
  // @ApiBearerAuth()
  @ApiOperation({ summary: 'Get single product' })
  @Get(':id')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  async getProductById(
    @Param('id') params: string,
    // @AuthJwt() payload: JwtPayload,
  ): Promise<BaseResponse<Product>> {
    const response: BaseResponse<Product> = {};
    const product = await this.productService.getProductById(params);
    if (!product) {
      response.error = {
        code: HttpStatus.BAD_REQUEST,
        message: 'ERROR.',
      };
    } else {
      response.data = product;
    }
    return response;
  }

  @ApiOkResponse({
    description: 'Delete product',
    type: Product,
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete product' })
  @Get('/track/:id')
  @RolesAllowed(ROLE_OWNER, ROLE_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async deleteProduct(
    @Param('id') params: string,
    // @AuthJwt() payload: JwtPayload,
  ): Promise<any> {
    const response: BaseResponse<any> = {};
    const product = await this.productService.deleteProduct(params);
    if (!product) {
      response.error = {
        code: HttpStatus.BAD_REQUEST,
        message: 'ERROR.',
      };
    } else {
      response.data = product;
    }
    return response;
  }

  @ApiOkResponse({
    description: 'Remove product',
    type: Product,
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove product' })
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async removeProduct(
    @Param('id') params: string,
    // @AuthJwt() payload: JwtPayload,
  ): Promise<any> {
    const response: BaseResponse<any> = {};
    try {
      const result = await this.productService.removeProduct(params);
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