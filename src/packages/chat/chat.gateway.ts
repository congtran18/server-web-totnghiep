import { MessageService } from 'src/collections/message/message.service';
import { UsersService } from 'src/collections/users/users.service';
import { AuthService } from 'src/collections/auth/auth.service';
import { TutorService } from 'src/collections/tutor/tutor.service';
import { User } from 'src/collections/users/schemas/user.schema';
import { Tutor } from 'src/collections/tutor/schemas/tutor.schema';
import { Logger, ValidationPipe } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway, WebSocketServer, MessageBody } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CreateMessageDto } from 'src/collections/message/dto/create-message.dto';

interface SocketWithUserData extends Socket {
  user: Partial<User> | null;
}

@WebSocketGateway({
  namespace: 'chat'
})
export class ChatGateway {
  private readonly logger = new Logger(ChatGateway.name);

  @WebSocketServer()
  private readonly server: Server | undefined;

  constructor(
    private readonly usersService: UsersService,
    private readonly messageService: MessageService,
    private readonly authService: AuthService,
    private readonly tutorService: TutorService,
  ) { }

  async handleConnection(socket: SocketWithUserData): Promise<void> {
    try {
      // get user from token
      // const userFromSocket = await this.wsAuthStrategy.validate(
      //   getUserFromWSToken(socket.handshake),
      // );

      const validateUser = await this.authService.getUserFromWSToken(socket.handshake)
      // console.log("validateUser",validateUser)
      const userFromSocket = await this.usersService.getUserByUid(validateUser.uid)
      // update user online status
      if (userFromSocket) {
        const updatedUser = await this.usersService.updateStatusUser(userFromSocket.uid, true);
        // const updatedTutor = await this.tutorService.updateStatusTutor(userFromSocket.uid, true);
        // set user on socket
        socket.user = updatedUser;
        this.logger.verbose('Client connected to chat');
        // retrieve connected users
        const connectedUsers = await this.usersService.findAll();
        // const connectedTutors = await this.usersService.findAllTutor()
        // join user to a chat room (private)
        if (updatedUser) {
          socket.join(updatedUser?.uid);
        }
        this.server?.emit('online-users', connectedUsers);
      }
    } catch (e) {
      this.logger.error(
        'Socket disconnected within handleConnection() in AppGateway:',
        e,
      );
      socket.disconnect();
      return;
    }
  }

  async handleDisconnect(client: SocketWithUserData) {
    try {
      // update user online status to false
      const tutor = client.user;
      await this.usersService.updateStatusUser(tutor?.uid, false);
      // await this.tutorService.updateStatusTutor(tutor?.uid, false);
      // retrieve connected users
      const connectedUsers = await this.usersService.findAll();
      this.server?.emit('online-users', connectedUsers);
      this.logger.warn('Client disconnected: chat');
    } catch (error) {
      this.logger.error('Disconection with errors');
    }
  }

  @SubscribeMessage('private-message')
  async handleMessage(@MessageBody() message: CreateMessageDto): Promise<void> {
    const createMessage = await this.messageService.create(message);
    this.server?.to(message.to).emit('private-message', createMessage);
    this.server?.to(message.from).emit('private-message', createMessage);
  }

  @SubscribeMessage('private-lesson-message')
  async handleLessonMessage(@MessageBody() message: any): Promise<void> {
    this.server?.to(message.uid[0]).emit('private-lesson-message', "oke");
    this.server?.to(message.uid[1]).emit('private-lesson-message', "oke");
  }
}
