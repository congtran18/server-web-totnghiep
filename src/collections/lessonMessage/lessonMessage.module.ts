import {LessonMessageController} from './lessonMessage.controller';
import {LessonMessageService} from './lessonMessage.service';
import {LessonMessage, LessonMessageSchema} from "./schemas/lessonMessage.schema";
import {MongooseModule} from "@nestjs/mongoose";
import {forwardRef, Module} from '@nestjs/common';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: LessonMessage.name, schema: LessonMessageSchema},
    ]),
  ],
  controllers: [LessonMessageController],
  providers: [LessonMessageService],
  exports: [LessonMessageService]
})
export class LessonMessageModule {
}
