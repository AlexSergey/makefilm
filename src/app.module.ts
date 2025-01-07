import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';

import databaseConfig from './common/database/config/database.config';
import { TypeOrmConfigService } from './common/database/typeorm-config.service';
import loggerConfig from './common/logger/config/logger.config';
import { LoggerModule } from './common/logger/logger.module';
import { MetricsModule } from './common/metrics/metrics.module';
import appConfig from './config/app.config';
import { ArticleModule } from './modules/article/article.module';

@Module({
  controllers: [],
  imports: [
    ConfigModule.forRoot({
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
    ArticleModule,
  ],
  providers: [],
})
export class AppModule {}
