import { Logger, ValidationPipe } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway, OnGatewayConnection, WebSocketServer, MessageBody, OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io'
import { AnswerCallDto } from './dto/AnswerCallDto';
import { CallUserEventDto } from './dto/CallUserEvent';
import { RejectCallEventDto } from './dto/RejectCallDto';
import { UsersService } from 'src/collections/users/users.service';
import { AuthService } from 'src/collections/auth/auth.service';

@WebSocketGateway({ namespace: 'videoChat' })
export class VideoChatGateway implements OnGatewayConnection, OnGatewayDisconnect {

  private readonly logger = new Logger(VideoChatGateway.name);

  @WebSocketServer()
  server: Server | undefined;

  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) { }

  private users = {}

  async handleConnection(socket: Socket) {
    const validateUser = await this.authService.getUserFromWSToken(socket.handshake)
    const userFromSocket = await this.usersService.getUserByUid(validateUser.uid)
    if (userFromSocket) {
      const id = userFromSocket.uid
      this.users[id] = socket.id
      socket.emit('me', id)
      this.server?.to(socket.id).emit('hey', 'Helloo')
      socket.on("updateMyMedia", ({ type, currentMediaStatus }) => {
        console.log("updateMyMedia");
        socket.broadcast.emit("updateUserMedia", { type, currentMediaStatus });
      });
      this.logger.log(`New Socket >> ${socket.id}`)
    }
  }

  async handleDisconnect(socket: Socket) {
    this.logger.log(`Socket Disconnect >> ${socket.id}`)
    for (var f in this.users) {
      if (this.users.hasOwnProperty(f) && this.users[f] == socket.id) {
        delete this.users[f];
      }
    }
  }

  @SubscribeMessage('call.user')
  async callUser(@MessageBody(ValidationPipe) data: CallUserEventDto) {
    this.logger.log(`Call User Event `)
    await this.usersService.updateCallingUser(data.from.socket_id, data.user_to_call, true);
    const connectedUsers = await this.usersService.findAll();
    this.server?.emit('online-users', connectedUsers);
    this.server?.to(this.users[data.user_to_call]).emit('user.calling', { signal: data.signal, from: data.from })
  }


  @SubscribeMessage('answer.call')
  answerCall(@MessageBody(ValidationPipe) data: AnswerCallDto) {
    this.logger.log(`Answer Call Event `)
    this.server?.to(this.users[data.to]).emit('call.accepted', { signal: data.signal })
  }

  @SubscribeMessage('reject.call')
  async rejectCall(@MessageBody(ValidationPipe) data: RejectCallEventDto) {
    this.logger.log(`Reject Call Event Event `)
    await this.usersService.updateCallingUser(data.from, data.to, false);
    this.server?.to(this.users[data.to]).emit('call.rejected', { from: data.from })
  }

  @SubscribeMessage('cancel.call')
  async cancelCall(@MessageBody(ValidationPipe) data: RejectCallEventDto) {
    this.logger.log(`Cancel Call Event  `)
    await this.usersService.updateCallingUser(data.from, data.to, false);
    this.server?.to(this.users[data.to]).emit('call.cancelled', { from: data.from })
  }

  @SubscribeMessage('end.call')
  async endCall(@MessageBody(ValidationPipe) data: RejectCallEventDto) {
    this.logger.log(`End Call Event `)
    await this.usersService.updateCallingUser(data.from, data.to, false);
    this.server?.to(this.users[data.to]).emit('call.ended', { from: data.from })
  }

  // @SubscribeMessage('updateMyMedia')
  // updateMedia(socket: Socket, @MessageBody(ValidationPipe) data: { type: any, currentMediaStatus: any }) {
  //   this.logger.log(`Update My Media `)
  //   socket.emit("updateUserMedia", { type: data.type, currentMediaStatus: data.currentMediaStatus });
  // }
}
