import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) { }

  async sendUserConfirmation(email?: string, type?: string, createAt?: string, shippingPrice?: number, totalPrice?: number, books?: any[]) {
    // const url = `example.com/auth/confirm?token=${token}`;

    console.log("books totalPrice", totalPrice)
    console.log("books shippingPrice", shippingPrice)

    await this.mailerService.sendMail({
      to: email || 'tranvanthanhcooong@gmail.com',
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Đơn hàng của bạn',
      template: './orderBook', // `.hbs` extension is appended automatically
      context: {
        email,
        type,
        createAt,
        shippingPrice,
        totalPrice,
        books: books ? books : [{ id: 2, name: 'Bộ sách toán thpt dung ngu dai', qty: 1, unit_price: 100050 }, { id: 2, name: 'Bộ sách toán thpt dung ngu dai', qty: 1, unit_price: 100050 }]
      },
    });
  }
}
