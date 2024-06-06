import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as serviceAccount from './configs/firebase.json';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import { NextFunction, Request, Response } from 'express';

export const initializeFirebase = () => {
  const firebaseServiceAccount = JSON.parse(JSON.stringify(serviceAccount));

  if (admin.apps.length === 0) {
    admin.initializeApp({
      credential: admin.credential.cert(firebaseServiceAccount),
      storageBucket: 'twt-clone-b4321.appspot.com',
    });
  }
};

async function bootstrap() {
  const firebaseServiceAccount = JSON.parse(JSON.stringify(serviceAccount));

  if (admin.apps.length === 0) {
    admin.initializeApp({
      credential: admin.credential.cert(firebaseServiceAccount),
      storageBucket: 'twt-clone-b4321.appspot.com',
    });
  }

  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'https://twt-clone-b4321.web.app',
    methods: 'GET,HEAD,OPTIONS,POST,PUT, PATCH, DELETE',
    allowedHeaders:
      'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cookie',
    credentials: true,
  });

  app.use(cookieParser());

  app.use(bodyParser.json({ limit: '1mb' }));
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  app.use(function (req: Request, res: Response, next: NextFunction) {
    res.setHeader(
      'Access-Control-Allow-Origin',
      'https://twt-clone-b4321.web.app',
    );
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cookie',
    );

    next();
  });

  await app.listen(7774);
}

bootstrap();
