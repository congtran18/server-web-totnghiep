import { MessageService } from './../message/message.service';
import { UsersService } from 'src/collections/users/users.service';
import { AuthService } from 'src/collections/auth/auth.service';
import { User } from 'src/collections/users/schemas/user.schema';
import { Logger } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CreateMessageDto } from '../message/dto/create-message.dto';

interface SocketWithUserData extends Socket {
  user: Partial<User> | null;
}

@WebSocketGateway({origins: 'https://server-web-totnghiep.herokuapp.com', path: 'chat'})
export class ChatGateway {
  @WebSocketServer()
  private readonly server: Server | undefined;

  constructor(
    private readonly usersService: UsersService,
    private readonly messageService: MessageService,
    private readonly authService: AuthService,
  ) { }

  async handleConnection(socket: SocketWithUserData): Promise<void> {
    const logger = new Logger();
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
        // set user on socket
        socket.user = updatedUser;
        logger.verbose('Client connected to chat');
        // retrieve connected users
        const connectedUsers = await this.usersService.findAll();
        // join user to a chat room (private)
        if (updatedUser) {
          socket.join(updatedUser?.uid);
        }
        this.server?.emit('online-users', connectedUsers);
      }
    } catch (e) {
      logger.error(
        'Socket disconnected within handleConnection() in AppGateway:',
        e,
      );
      socket.disconnect();
      return;
    }
  }

  async handleDisconnect(client: SocketWithUserData) {
    const logger = new Logger();
    try {
      // update user online status to false
      const user = client.user;
      await this.usersService.updateStatusUser(user?.uid, false);
      // retrieve connected users
      const connectedUsers = await this.usersService.findAll();
      this.server?.emit('online-users', connectedUsers);
      logger.warn('Client disconnected: chat');
    } catch (error) {
      logger.error('Disconection with errors');
    }
  }

  @SubscribeMessage('private-message')
  async handleMessage(@MessageBody() message: CreateMessageDto): Promise<void> {
    const createMessage = await this.messageService.create(message);
    this.server?.to(message.to).emit('private-message', createMessage);
    this.server?.to(message.from).emit('private-message', createMessage);
  }
}
