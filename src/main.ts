import { patchNestjsSwagger } from '@anatine/zod-nestjs';
import { ClassSerializerInterceptor, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express';
import 'dotenv/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

import { AppModule } from './app.module';
import { AllConfigType } from './config/config.type';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { TransformInterceptor } from './interceptors/transform.interceptor';
// import {LoggerService} from './logger/logger.service';
import { ResolvePromisesInterceptor } from './utils/serializer.interceptor';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, new ExpressAdapter(), {
    cors: true,
  });
  app.use((req, res, next) => {
    res.header('Access-Control-Expose-Headers', 'Content-Range');
    next();
  });
  app.enable('trust proxy'); // only if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
  app.use(helmet());
  const configService = app.get(ConfigService<AllConfigType>);
  // const logger = await app.resolve(Logger);
  app.enableShutdownHooks();

  app.setGlobalPrefix(configService.getOrThrow('app.apiPrefix', { infer: true }), {
    exclude: ['/'],
  });
  app.enableVersioning({
    type: VersioningType.URI,
  });
  const reflector = app.get(Reflector);

  // Global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());
  // Global pipes
  // Global interceptor
  app.useGlobalInterceptors(
    new ResolvePromisesInterceptor(),
    // ResolvePromisesInterceptor is used to resolve promises in responses because class-transformer can't do it
    // https://github.com/typestack/class-transformer/issues/549
    new ClassSerializerInterceptor(reflector),
    new TransformInterceptor(),
  );

  const options = new DocumentBuilder()
    .setTitle('API')
    .setDescription('API docs')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  patchNestjsSwagger();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);

  await app.listen(configService.getOrThrow('app.port', { infer: true }));
  /* logger.log(
    `App ready on port ${configService.getOrThrow('app.port', { infer: true })}`,
  );*/
}

bootstrap();
