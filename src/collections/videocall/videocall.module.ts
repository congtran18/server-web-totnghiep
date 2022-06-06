import { Module } from '@nestjs/common';
import { VideocallController } from './videocall.controller';
import { VideocallService } from './videocall.service';
import { Videocall, VideocallSchema } from './schemas/videocall.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Videocall.name, schema: VideocallSchema },
    ]),
  ],
  controllers: [VideocallController],
  providers: [VideocallService],
  exports: [VideocallService],
})

 export class VideocallModule {}
