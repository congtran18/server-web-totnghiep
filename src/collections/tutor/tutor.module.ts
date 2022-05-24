import {Module} from '@nestjs/common';
import {TutorController} from './tutor.controller';
import {TutorService} from './tutor.service';
import {Tutor, TutorSchema} from "./schemas/tutor.schema";
import {MongooseModule} from "@nestjs/mongoose";

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: Tutor.name, schema: TutorSchema},
    ])
  ],
  controllers: [TutorController],
  providers: [TutorService],
  exports: [TutorService]
})
export class TutorModule {
}
