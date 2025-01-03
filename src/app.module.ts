import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import appConfig from './config/app.config';
import { ArticleModule } from './modules/article/article.module';

@Module({
  controllers: [],
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
      load: [appConfig],
    }),
    ArticleModule,
  ],
  providers: [],
})
export class AppModule {}
