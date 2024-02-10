import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import fastifyCookie, { FastifyCookieOptions } from '@fastify/cookie';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.register(fastifyCookie, {
    secret: 'token-secret',
    parseOptions: {
      secure: true,
      httpOnly: true,
      sameSite: 'none',
    },
  } as FastifyCookieOptions);

  app.useGlobalPipes(new ValidationPipe());

  app.enableCors({
    origin: true,
    credentials: true,
  });

  await app.listen(process.env.PORT, process.env.BASE_HOST);
}
bootstrap();
