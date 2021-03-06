import {CalendarController} from './calendar.controller';
import {CalendarService} from './calendar.service';
import {Calendar, CalendarSchema} from "./schemas/calendar.schema";
import {MongooseModule} from "@nestjs/mongoose";
import {forwardRef, Module} from '@nestjs/common';
import {LessonModule} from "../lesson/lesson.module";
import {TutorModule} from "../tutor/tutor.module";
import {LessonMessageModule} from "../lessonMessage/lessonMessage.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: Calendar.name, schema: CalendarSchema},
    ]),
    TutorModule,
    LessonMessageModule,
    forwardRef(() => LessonModule),
  ],
  controllers: [CalendarController],
  providers: [CalendarService],
  exports: [CalendarService]
})
export class CalendarModule {
}
