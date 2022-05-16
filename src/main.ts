import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { AllExceptionFilter } from "./utils/all.exception.filter";
import { Logger, ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import morgan from 'morgan';
import moment from 'moment';
import { MigrationService } from "./packages/migration/migration.service";
import { MigrationModule } from "./packages/migration/migration.module";
import { NestExpressApplication } from "@nestjs/platform-express";
import * as admin from 'firebase-admin';
import * as bodyParser from 'body-parser';
import { ServiceAccount } from 'firebase-admin';
import * as serviceAccount from './serviceAccountKey.json';
import { IncomingMessage, ServerResponse } from 'http';
declare const module: any;

async function bootstrap() {
  const logger = new Logger('main');
  const sslConfig = require(__dirname + '/../private/ssl/ssl-config');
  const httpsOptions = {
    key: sslConfig.privateKey,
    cert: sslConfig.certificate
  }

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as ServiceAccount),
  });

  const isDev = true;
  const app = await NestFactory.create<NestExpressApplication>(AppModule, isDev ? {} : {
    httpsOptions: httpsOptions,
  });

  // //------Standalone Applications------//
  // // https://docs.nestjs.com/standalone-applications
  // // Application logic......
  // Get migration module: https://docs.nestjs.com/standalone-applications
  const migrationService = app.select(MigrationModule).get(MigrationService, { strict: true });
  await migrationService.migrate();

  const rawBodyBuffer = (req: IncomingMessage, res: ServerResponse, buf: Buffer, encoding: BufferEncoding) => {
    if (!req.headers['stripe-signature']) { return; }

    if (buf && buf.length) {
      req['rawBody'] = buf.toString(encoding || 'utf8');
    }
  };

  app.use(bodyParser.urlencoded({ verify: rawBodyBuffer, extended: true }));
  app.use(bodyParser.json({ verify: rawBodyBuffer }));

  //------Web Applications------//
  // For nginx proxy forward
  // => update nginx.conf
  // proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  // proxy_set_header X-Real-IP $remote_addr;
  // proxy_set_header Host $host;
  app.set('trust proxy', 'loopback');
  morgan.token('date', (req, res, tz) => moment().utc().utcOffset("+0700").format());
  const morganFormat = ':remote-addr - :remote-user [:date] :method :url :status - :response-time ms :user-agent';
  app.use(morgan(morganFormat));
  app.enableCors();
  app.setGlobalPrefix('api');
  app.useGlobalFilters(new AllExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());
  // Enable Swagger api docs module
  const options = new DocumentBuilder()
    .setTitle('The API document')
    .setDescription('----------')
    .setVersion(process.env.npm_package_version ?? '')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);

  const port = parseInt(process.env.PORT || '3000');
  await app.listen(port, '0.0.0.0');
  logger.log(`Application is running on: ${await app.getUrl()}`);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }

}

bootstrap().then();
