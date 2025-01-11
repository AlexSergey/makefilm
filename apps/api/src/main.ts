import { ClassSerializerInterceptor, ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { config } from 'dotenv';
import helmet from 'helmet';

import { AppModule } from './app.module';
import { LoggerService } from './common/logger/logger.service';
import { MetricsService } from './common/metrics/metrics.service';
import { AppConfig } from './config/app-config.type';
import { AllConfigType } from './config/config.type';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { ErrorMetricsInterceptor } from './interceptors/error-metrics.interceptor';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { ResolvePromisesInterceptor } from './utils/serializer.interceptor';

config({
  override: false,
});

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
  const configService = await app.resolve(ConfigService<AllConfigType>);
  const logger = await app.resolve(LoggerService);
  app.enableShutdownHooks();

  app.setGlobalPrefix(configService.getOrThrow<AppConfig['apiPrefix']>('app.apiPrefix', { infer: true }), {
    exclude: ['/'],
  });
  app.enableVersioning({
    type: VersioningType.URI,
  });
  const reflector = app.get(Reflector);
  const metricsService = await app.resolve(MetricsService);

  // Global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());
  // Global pipes
  app.useGlobalPipes(new ValidationPipe());
  // Global interceptor
  app.useGlobalInterceptors(
    new ErrorMetricsInterceptor(metricsService, configService),
    // ResolvePromisesInterceptor is used to resolve promises in responses because class-transformer can't do it
    // https://github.com/typestack/class-transformer/issues/549
    new ResolvePromisesInterceptor(),
    new ClassSerializerInterceptor(reflector),
    new TransformInterceptor(),
  );

  const options = new DocumentBuilder()
    .setTitle('API')
    .setDescription('API docs')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);
  const port = configService.getOrThrow<AppConfig['port']>('app.port', { infer: true });
  await app.listen(port);
  logger.log(`App ready on port ${port}`);
}

bootstrap();
