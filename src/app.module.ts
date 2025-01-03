import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import loggerConfig from './common/logger/config/logger.config';
import { LoggerModule } from './common/logger/logger.module';
import appConfig from './config/app.config';
import { ArticleModule } from './modules/article/article.module';

@Module({
  controllers: [],
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
      load: [appConfig, loggerConfig],
    }),
    LoggerModule,
    ArticleModule,
  ],
  providers: [],
})
export class AppModule {}
