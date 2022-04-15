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
import { CreateCategoryProductDto } from './dto/create-categoryProduct.dto';
import { UpdateCategoryProductDto } from './dto/update-categoryProduct.dto';
import { CategoryProduct } from './schemas/categoryProduct.schema';
import { CategoryProductService } from './categoryProduct.service';

@ApiTags('category product')
@Controller('categoryProduct')
export class CategoryProductController {
  private logger: Logger = new Logger(CategoryProductController.name);

  constructor(private readonly categoryProductService: CategoryProductService) { }

  @ApiOkResponse({
    description: 'Create category product',
    type: CategoryProduct,
  })
  // @ApiBearerAuth()
  @ApiOperation({ summary: 'Create category product' })
  @Post()
  // @UseGuards(JwtAuthGuard, RolesGuard)
  async createCategoryProduct(
    @Body() createCategoryProducttDto: CreateCategoryProductDto,
    // @AuthJwt() payload: JwtPayload,
  ): Promise<BaseResponse<Model<CategoryProduct>>> {
    const response: BaseResponse<Model<CategoryProduct>> = {};
    const categoryProduct = await this.categoryProductService.createCategoryProduct(createCategoryProducttDto);
    if (!categoryProduct) {
      response.error = {
        code: HttpStatus.BAD_REQUEST,
        message: 'ERROR.',
      };
    } else {
      response.data = categoryProduct;
    }
    return response;
  }

  @ApiOkResponse({
    description: 'Update category product',
    type: CategoryProduct,
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update product' })
  @Put()
  @UseGuards(JwtAuthGuard, RolesGuard)
  async updateCategoryProduct(
    @Body() updateCategoryProducttDto: UpdateCategoryProductDto,
    // @AuthJwt() payload: JwtPayload,
  ): Promise<BaseResponse<Model<CategoryProduct>>> {
    const response: BaseResponse<Model<CategoryProduct>> = {};
    const categoryProduct = await this.categoryProductService.updateCategoryProduct(updateCategoryProducttDto);
    if (!categoryProduct) {
      response.error = {
        code: HttpStatus.BAD_REQUEST,
        message: 'ERROR.',
      };
    } else {
      response.data = categoryProduct;
    }
    return response;
  }

  @ApiOkResponse({
    description: 'Get all category product',
    type: CategoryProduct,
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all category product' })
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getAllCategoryProduct(
    // @AuthJwt() payload: JwtPayload,
  ): Promise<BaseResponse<CategoryProduct>> {
    const response: BaseResponse<CategoryProduct> = {};
    const categoryProduct = await this.categoryProductService.getAllCategoryProduct();
    if (!categoryProduct) {
      response.error = {
        code: HttpStatus.BAD_REQUEST,
        message: 'ERROR.',
      };
    } else {
      response.data = categoryProduct
    }
    return response;
  }

  @ApiOkResponse({
    description: 'Get single category product',
    type: CategoryProduct,
  })
  // @ApiBearerAuth()
  @ApiOperation({ summary: 'Get single product' })
  @Get(':id')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  async getCategoryProductById(
    @Param('id') params: string,
    // @AuthJwt() payload: JwtPayload,
  ): Promise<BaseResponse<CategoryProduct>> {
    const response: BaseResponse<CategoryProduct> = {};
    const categoryProduct = await this.categoryProductService.getCategoryProductById(params);
    if (!categoryProduct) {
      response.error = {
        code: HttpStatus.BAD_REQUEST,
        message: 'ERROR.',
      };
    } else {
      response.data = categoryProduct;
    }
    return response;
  }

  @ApiOkResponse({
    description: 'Delete category product',
    type: CategoryProduct,
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete category product' })
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async deleteCategoryProduct(
    @Param('id') params: string,
    // @AuthJwt() payload: JwtPayload,
  ): Promise<BaseResponse<CategoryProduct>> {
    const response: BaseResponse<CategoryProduct> = {};
    const categoryProduct = await this.categoryProductService.deleteCategoryProduct(params);
    if (!categoryProduct) {
      response.error = {
        code: HttpStatus.BAD_REQUEST,
        message: 'ERROR.',
      };
    } else {
      response.data = categoryProduct;
    }
    return response;
  }
}