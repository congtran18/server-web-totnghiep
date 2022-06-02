import { Module } from '@nestjs/common';
import { VideoChatGateway } from './videoChat.gateway';
import { UsersModule } from 'src/collections/users/users.module';
import { AuthModule } from 'src/collections/auth/auth.module';

@Module({
  providers: [VideoChatGateway],
  imports: [AuthModule, UsersModule],
})
export class VideoChatModule {}
