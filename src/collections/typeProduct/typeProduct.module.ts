import { Module } from '@nestjs/common';
import { TypeProductController } from './typeProduct.controller';
import { TypeProductService } from './typeProduct.service';
import { TypeProduct, TypeProductSchema } from './schemas/typeProduct.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TypeProduct.name, schema: TypeProductSchema },
    ]),
  ],
  controllers: [TypeProductController],
  providers: [TypeProductService],
  exports: [TypeProductService],
})

 export class TypeProductModule {}
