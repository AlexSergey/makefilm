import databaseConfig from '@api/common/database/config/database.config';
import { TypeOrmConfigService } from '@api/common/database/typeorm-config.service';
import loggerConfig from '@api/common/logger/config/logger.config';
import { LoggerModule } from '@api/common/logger/logger.module';
import { MetricsModule } from '@api/common/metrics/metrics.module';
import appConfig from '@api/config/app.config';
import { HttpExceptionFilter } from '@api/filters/http-exception.filter';
import { TransformInterceptor } from '@api/interceptors/transform.interceptor';
import { ResolvePromisesInterceptor } from '@api/utils/serializer.interceptor';
import { ClassSerializerInterceptor, INestApplication, Type } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';

export const bootstrap = async <T>(TestabeModule: Type<T>): Promise<INestApplication> => {
  const module: TestingModule = await Test.createTestingModule({
    controllers: [],
    imports: [
      ConfigModule.forRoot({
        envFilePath: ['.env.tests'],
        isGlobal: true,
        load: [appConfig, loggerConfig, databaseConfig],
      }),
      LoggerModule,
      MetricsModule,
      TypeOrmModule.forRootAsync({
        dataSourceFactory: async (options: DataSourceOptions) => {
          return new DataSource(options).initialize();
        },
        useClass: TypeOrmConfigService,
      }),
      TestabeModule,
    ],
    providers: [],
  }).compile();

  const app = module.createNestApplication();
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
  await app.init();

  return app;
};
