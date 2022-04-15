import { Module } from '@nestjs/common';
import { CategoryProductController } from './categoryProduct.controller';
import { CategoryProductService } from './categoryProduct.service';
import { CategoryProduct, CategoryProductSchema } from './schemas/categoryProduct.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CategoryProduct.name, schema: CategoryProductSchema },
    ]),
  ],
  controllers: [CategoryProductController],
  providers: [CategoryProductService],
  exports: [CategoryProductService],
})

 export class CategoryProductModule {}
