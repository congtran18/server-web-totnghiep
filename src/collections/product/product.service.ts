import { Injectable } from '@nestjs/common';
import { Connection, Model } from 'mongoose';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Product } from './schemas/product.schema';
import { CategoryProduct } from '../categoryProduct/schemas/categoryProduct.schema';
import { CreateProducttDto } from './dto/create-product.dto';
import { UpdateProducttDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectConnection() private connection: Connection,
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(CategoryProduct.name) private CategoryProductModel: Model<CategoryProduct>,
  ) { }

  async isEmpty(): Promise<boolean> {
    return (await this.productModel.estimatedDocumentCount().exec()) == 0;
  }

  async getProductById(id: string): Promise<any> {
    const result = await this.productModel.findOne({
      _id: id,
      isDeleted: false,
    });
    return result;
  }

  async getOldPool(projectId: string, poolTitle: string, network: string, chainId: string): Promise<any> {
    // const result = await this.productModel.aggregate([
    //   // where: {
    //   //   contractIsFinished: false,
    //   //   contractIsFail: false,
    //   //   // contractPoolSync: false,// chua sync
    //   //   // smartContractAddress: {neq: null},
    //   //   // chainId: {neq: null},
    //   //   // network: 'bsc',
    //   // },
    //   //{ contractIsFinished: false }, { contractIsFail: false }, 
    //   { $match: { $and: [{ projectId: projectId }, { poolTitle: poolTitle }, { network: network }, { chainId: chainId }] } }
    // ]);

    const result = await this.productModel.findOne({ projectId: projectId, poolTitle: poolTitle, network: network, chainId: chainId })

    if (result) {
      return true;
    } else {
      return false;
    }
  }

  async getAllProduct(page?: string, limit?: string, type?: string, category?: string, realname?: string): Promise<any> {
    let pageNumber = 1;
    let limitNumber = 100;
    if (page) {
      pageNumber = parseInt(page);
    }

    if (limit) {
      limitNumber = parseInt(limit);
    }

    var productfilter = {}

    if(realname){
      productfilter = {"realname": new RegExp(realname, 'i'), ...productfilter};
    }
    if (type) {
      console.log(type)
      productfilter = {"type": type, ...productfilter};
    }
    if (category) {
      productfilter= {"category": category, ...productfilter};
    }

    const result = await this.productModel
      .find(productfilter).sort([['create_at', 'descending']]).populate('type').populate('category')
      .limit(limitNumber)
      .skip((pageNumber - 1) * limitNumber);

    let total = await this.productModel.countDocuments(productfilter)

    total = Math.ceil(total / limitNumber);

    return { 'product': result, 'total': total };
  }

  async createProduct(
    createProducttDto: CreateProducttDto,
  ): Promise<any> {
    const categoryProductService = await this.CategoryProductModel.findOne({
      _id: createProducttDto.category,
    });

    const categoryname = categoryProductService?.realname

    let code : any;
    let codeexit: any;
	//Sinh ra mã ko bị trùng

  

    do {
      code = (( categoryname?  categoryname?.split(" ") : []).concat("-").concat(createProducttDto.realname.split(" ") || []))
      code = code.map((codeelement) => codeelement[0]).join('').concat("00").concat((Math.floor(Math.random() * 1000).toString()))
      //loại bỏ dấu tiếng việt
      code = code.normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd').replace(/Đ/g, 'D');
      code = code.toUpperCase()
      codeexit = await this.productModel.findOne({ code: code });
    } while (codeexit !== null)
  
    const model = new this.productModel({
      ...createProducttDto,code
    });
    const modelRes = await model.save();
    if (modelRes) {
      const obj = modelRes.toObject<Model<Product>>();
      // delete obj._id;
      // delete obj.__v;
      return obj;
    }
    return null;
  }

  async updateProduct(updateProducttDto: UpdateProducttDto): Promise<any> {
    const { _id, ...rest } = updateProducttDto;

    const result = await this.productModel.findOneAndUpdate(
      {
        _id: _id,
      },
      rest,
      {
        new: true,
        useFindAndModify: false,
      },
    );
    return result;
  }

  async deleteProduct(id: string): Promise<any> {
    const result = await this.productModel.findOneAndUpdate(
      {
        _id: id,
      },
      {
        isDeleted: true,
      },
      {
        new: true,
        useFindAndModify: false,
      },
    );
    return result;
  }
}