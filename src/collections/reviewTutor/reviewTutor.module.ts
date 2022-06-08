import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { ReviewTutorService } from './reviewTutor.service';
import { ReviewTutorController } from './reviewTutor.controller';
import { ReviewTutor, ReviewTutorSchema } from './schemas/reviewTutor.schema';
import { AuthModule } from 'src/collections/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ReviewTutor.name,
        schema: ReviewTutorSchema,
      },
    ]),
    AuthModule,
  ],
  controllers: [ReviewTutorController],
  providers: [ReviewTutorService],
  exports: [ReviewTutorService],
})
export class ReviewTutorModule {}
