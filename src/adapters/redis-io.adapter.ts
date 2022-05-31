import { INestApplicationContext, Logger } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';
import redisIoAdapter from 'socket.io-redis';

const redisAdapter: any = redisIoAdapter;

export class RedisIoAdapter extends IoAdapter {

  // constructor(private app: INestApplicationContext) {
  //   super(app);
  // }

  createIOServer(port: number, options: ServerOptions): any {
    // options.allowRequest = async (request, allowFunction) => {
    //   const logger = new Logger();
    //   logger.verbose(`Authenticated client`);
    //   return allowFunction(null, true);
    // };
    const server = super.createIOServer(port, options);
    const adapter = redisAdapter({ host: 'localhost', port: 3000, no_ready_check: true });
    server.adapter(adapter);
    return server;
  }
}
