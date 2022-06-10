import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) { }

  async sendUserConfirmation(email: string, type: string, createAt: string, shippingPrice: number, totalPrice: number, books: Array<any>) {
    // const url = `example.com/auth/confirm?token=${token}`;


    await this.mailerService.sendMail({
      to: email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Welcome to Nice App! Confirm your Email',
      template: './orderBook', // `.hbs` extension is appended automatically
      context: {
        email,
        type,
        createAt,
        shippingPrice,
        totalPrice,
        books
      },
    });
  }
}
