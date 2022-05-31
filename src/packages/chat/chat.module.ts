import { Module } from '@nestjs/common';
import { MessageModule } from './../message/message.module';
import { UsersModule } from 'src/collections/users/users.module';
import { AuthModule } from 'src/collections/auth/auth.module';
import { TutorModule } from 'src/collections/tutor/tutor.module';
import { ChatGateway } from './chat.gateway';

@Module({
  providers: [ChatGateway],
  imports: [AuthModule, UsersModule, MessageModule, TutorModule],
})
export class ChatModule {}
