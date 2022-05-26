import {TutorController} from './tutor.controller';
import {TutorService} from './tutor.service';
import {Tutor, TutorSchema} from "./schemas/tutor.schema";
import {MongooseModule} from "@nestjs/mongoose";
import {forwardRef, Module} from '@nestjs/common';
import {AdminsModule} from "../admins/admins.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: Tutor.name, schema: TutorSchema},
    ]),
    forwardRef(() => AdminsModule),
  ],
  controllers: [TutorController],
  providers: [TutorService],
  exports: [TutorService]
})
export class TutorModule {
}
