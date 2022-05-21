import { Module } from '@nestjs/common';
import {UsersModule} from "src/collections/users/users.module";
import { CronService } from './cron.service';

@Module({
  imports: [
    UsersModule,
  ],
  controllers: [],
  providers: [
    CronService,
  ],
  exports: [
    CronService,
  ]
})
export class CronModule { }