import { Module } from '@nestjs/common';
import { StakingController } from './staking.controller';
import { StakingService } from './staking.service';
import { Staking, StakingSchema } from './schemas/staking.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Staking.name, schema: StakingSchema },
    ]),
  ],
  controllers: [StakingController],
  providers: [StakingService],
  exports: [StakingService],
})

 export class StakingModule {}
