import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { WarningTutorService } from './warningTutor.service';
import { WarningTutorController } from './warningTutor.controller';
import { WarningTutor, WarningTutorSchema } from './schemas/warningTutor.schema';
import { AuthModule } from 'src/collections/auth/auth.module';
import {StorageModule} from 'src/collections/storage/storage.module'
import {TutorModule} from 'src/collections/tutor/tutor.module'

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: WarningTutor.name,
        schema: WarningTutorSchema,
      },
    ]),
    AuthModule,
    StorageModule,
    TutorModule
  ],
  controllers: [WarningTutorController],
  providers: [WarningTutorService],
  exports: [WarningTutorService],
})
export class WarningTutorModule {}
