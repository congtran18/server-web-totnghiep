import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) { }

  async sendUserConfirmation(email?: string, type?: string, createAt?: string, shippingPrice?: string, totalPrice?: string, books?: any[]) {
    // const url = `example.com/auth/confirm?token=${token}`;

    console.log("books totalPrice", totalPrice)
    console.log("books shippingPrice", shippingPrice)

    await this.mailerService.sendMail({
      to: email || 'tranvanthanhcooong@gmail.com',
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Welcome to Nice App! Confirm your Email',
      template: './orderBook', // `.hbs` extension is appended automatically
      context: {
        email,
        type,
        createAt,
        shippingPrice,
        totalPrice,
        books: books ? books : [{id: 2, name: 'Bộ sách toán thpt', qty: 1, unit_price: 100050}]
      },
    });
  }
}
