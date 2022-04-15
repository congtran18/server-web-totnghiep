import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppLogModule } from '../collections/app-log/app-log.module';
import { AppConfigModule } from '../collections/app-config/app-config.module';
import { MigrationModule } from '../packages/migration/migration.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { InMemoryDBModule } from '@nestjs-addons/in-memory-db';
import { UsersModule } from '../collections/users/users.module';
import { AuthModule } from '../collections/auth/auth.module';
import { AdminsModule } from '../collections/admins/admins.module';
import { ProductModule } from '../collections/product/product.module';
import { TypeProductModule } from '../collections/typeProduct/typeProduct.module';
import { CategoryProductModule } from '../collections/categoryProduct/categoryProduct.module';
//import {RealtimeModule} from "../packages/realtime/realtime.module";
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ProjectsModule } from '../collections/projects/projects.module';
import { UploadModule } from 'src/collections/upload/upload.module';
import { StorageModule } from 'src/collections/storage/storage.module';
import { StakingModule } from 'src/collections/staking/staking.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'public'),
      exclude: ['/api*'],
    }),
    MongooseModule.forRoot(process.env.MONGODB_URL ?? ''),
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
    TypeProductModule,
    CategoryProductModule,
    StakingModule,
    UsersModule,
    StorageModule,
    // RealtimeModule,
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
export class AppModule {}
