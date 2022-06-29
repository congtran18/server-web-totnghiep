import {LessonController} from './lesson.controller';
import {LessonService} from './lesson.service';
import {Lesson, LessonSchema} from "./schemas/lesson.schema";
import {MongooseModule} from "@nestjs/mongoose";
import {forwardRef, Module} from '@nestjs/common';
import {CalendarModule} from "../calendar/calendar.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: Lesson.name, schema: LessonSchema},
    ]),
    CalendarModule,
  ],
  controllers: [LessonController],
  providers: [LessonService],
  exports: [LessonService]
})
export class LessonModule {
}
