import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Global, Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { join } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library'

const GOOGLE_MAILER_CLIENT_ID = '102076741157-16dpomif1h5n06kppu3jqihqk2o47r89.apps.googleusercontent.com'
const GOOGLE_MAILER_CLIENT_SECRET = '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'
const GOOGLE_MAILER_REFRESH_TOKEN = '1//04FdHJ91IE3nmCgYIARAAGAQSNwF-L9Ir84xBD8xoKNA5x6umNiigJ5VnKNpwQDWMeaCFhf3-DQi51e0E2FmkKBeqqnBYKlae35g'
const ADMIN_EMAIL_ADDRESS = 'bestyasuo178@gmail.com'

const myOAuth2Client = new OAuth2Client(
  GOOGLE_MAILER_CLIENT_ID,
  GOOGLE_MAILER_CLIENT_SECRET
)
// Set Refresh Token vào OAuth2Client Credentials
myOAuth2Client.setCredentials({
  refresh_token: GOOGLE_MAILER_REFRESH_TOKEN
})

// const myAccessTokenObject = await myOAuth2Client.getAccessToken()
// // Access Token sẽ nằm trong property 'token' trong Object mà chúng ta vừa get được ở trên
// const myAccessToken = myAccessTokenObject?.token

@Global() // 👈 optional to make module global
@Module({
  imports: [
    ConfigModule,
    MailerModule.forRootAsync({
      // imports: [ConfigModule],
      inject: [ConfigService],
      // imports: [ConfigModule], // import module if not enabled globally
      useFactory: async (config: ConfigService) => ({
        // transport: config.get("MAIL_TRANSPORT"),
        // o
        
        transport: {
          host: 'smtp.gmail.com',
          port: 587,
          secure: false,
          service: 'gmail',
          auth: {
            type: 'OAuth2',
            user: process.env.ADMIN_EMAIL_ADDRESS,
            clientId: process.env.GOOGLE_MAILER_CLIENT_ID,
            clientSecret: process.env.GOOGLE_MAILER_CLIENT_SECRET,
            refresh_token: process.env.GOOGLE_MAILER_REFRESH_TOKEN,
            accessToken: process.env.GOOGLE_MAILER_ACCESS_TOKEN
          }
        },
        // tls: {
        //   rejectUnAuthorized: false
        // },
        // defaults: {
        //   from: `"No Reply" <${config.get('satthu10008@gmail.com')}>`,
        // },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      // inject: [ConfigService],
    }),
  ],
  controllers: [MailController],
  providers: [MailService],
  exports: [MailService],

})
export class MailModule { }
