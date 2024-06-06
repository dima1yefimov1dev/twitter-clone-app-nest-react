import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import * as functions from 'firebase-functions';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import { AppModule } from './app.module';
import { initializeFirebase } from './main';
import { NextFunction, Request, Response } from 'express';
import { ValidationPipe } from '@nestjs/common';

const expressServer = express();

const createFunction = async (expressInstance): Promise<void> => {
  initializeFirebase();

  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressInstance),
  );

  app.enableCors({
    origin: 'https://twt-clone-b4321.web.app',
    credentials: true,
    allowedHeaders:
      'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cookie',
    methods: 'GET,HEAD,OPTIONS,POST,PUT, PATCH, DELETE',
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

  await app.init();
};

export const api = functions.https.onRequest(async (request, response) => {
  await createFunction(expressServer);
  expressServer(request, response);
});
