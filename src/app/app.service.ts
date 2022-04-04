import {Injectable, Logger} from '@nestjs/common';
import {InjectConnection, InjectModel} from "@nestjs/mongoose";
import {Connection, Model} from "mongoose";

@Injectable()
export class AppService {
  readonly logger = new Logger(AppService.name);

  constructor(
    @InjectConnection() private connection: Connection,
  ) {

  }
}
