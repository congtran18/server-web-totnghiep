import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from '../order/schemas/order.schema';
import {UsersModule} from "../users/users.module";
import { MailModule } from 'src/packages/mail/mail.module'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
    ]),
    UsersModule,
    MailModule
  ],
  controllers: [StripeController],
  providers: [StripeService],
  exports: [StripeService]
})
export class StripeModule { }