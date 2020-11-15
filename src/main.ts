import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import * as compression from 'compression';
import * as helmet from 'helmet';
import * as rateLimit from 'express-rate-limit';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(compression());
  app.use(helmet());
  app.use(
    rateLimit({
      windowMs: 6000, // 15 minutes
      max: process.env.MAX_REQUEST_PER_MINUTE || 30, // limit each IP to 30 requests per windowMs
    }),
  );
  app.enableCors();
  app.setGlobalPrefix('/api');
  await app.listen(process.env.PORT || 9000);
  Logger.log('Server is started on port: ' + process.env.PORT);
}
bootstrap();
