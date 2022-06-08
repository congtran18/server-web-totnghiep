import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppLogModule } from 'src/collections/app-log/app-log.module';
import { AppConfigModule } from 'src/collections/app-config/app-config.module';
import { MigrationModule } from 'src/packages/migration/migration.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { InMemoryDBModule } from '@nestjs-addons/in-memory-db';

import { UsersModule } from 'src/collections/users/users.module';
import { AuthModule } from 'src/collections/auth/auth.module';
import { AdminsModule } from 'src/collections/admins/admins.module';
import { ProductModule } from 'src/collections/product/product.module';
import { OrderModule } from 'src/collections/order/order.module';
import { TypeProductModule } from 'src/collections/typeProduct/typeProduct.module';
import { CategoryProductModule } from 'src/collections/categoryProduct/categoryProduct.module';
//import {RealtimeModule} from "../packages/realtime/realtime.module";
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ProjectsModule } from 'src/collections/projects/projects.module';
import { TutorModule } from 'src/collections/tutor/tutor.module';
import { UploadModule } from 'src/collections/upload/upload.module';
import { StorageModule } from 'src/collections/storage/storage.module';
import { StripeModule } from 'src/collections/stripe/stripe.module'
import { CalendarModule } from 'src/collections/calendar/calendar.module'
import { VideocallModule } from 'src/collections/videocall/videocall.module';
import { ReviewTutorModule } from 'src/collections/reviewTutor/reviewTutor.module'

import { CronModule } from 'src/packages/cron/cron.module';
import { MessageModule } from 'src/collections/message/message.module';
import { ChatModule } from 'src/packages/chat/chat.module';
import { VideoChatModule } from 'src/packages/videoChat/videoChat.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'public'),
      exclude: ['/api*'],
    }),
    MongooseModule.forRoot(process.env.MONGODB_URL ?? 'mongodb+srv://@free.abcde.mongodb.net'),
    InMemoryDBModule.forRoot(),
    ScheduleModule.forRoot(),
    // https://docs.nestjs.com/security/rate-limiting
    // https://github.com/nestjs/throttler
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        ttl: config.get('THROTTLE_TTL', 120),
        // limit: config.get('THROTTLE_LIMIT', 10),
      }),
    }),
    MigrationModule,
    AppConfigModule,
    AppLogModule,
    AuthModule,
    AdminsModule,
    ProductModule,
    OrderModule,
    TypeProductModule,
    CategoryProductModule,
    UsersModule,
    StorageModule,
    TutorModule,
    MessageModule,
    ChatModule,
    VideoChatModule,
    ReviewTutorModule,
    // RealtimeModule,
    CalendarModule,
    VideocallModule,
    CronModule,
    StripeModule,
    ProjectsModule,
    UploadModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule { }
