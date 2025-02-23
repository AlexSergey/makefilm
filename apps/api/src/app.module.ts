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
import { ArticlesModule } from './modules/articles/articles.module';
import { AuthModule } from './modules/auth/auth.module';
import authConfig from './modules/auth/config/auth.config';
import { GeolocationModule } from './modules/geolocation/geolocation.module';
import { HealthModule } from './modules/health/health.module';
import jwtConfig from './modules/jwt/config/jwt.config';
import mailerConfig from './modules/mailer/config/mailer.config';
import { MailerModule } from './modules/mailer/mailer.module';
import { MoviesModule } from './modules/movies/movies.module';
import passwordConfig from './modules/password/config/password.config';
import { SessionsModule } from './modules/sessions/sessions.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  controllers: [],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, loggerConfig, databaseConfig, mailerConfig, passwordConfig, jwtConfig, authConfig],
    }),
    LoggerModule,
    MetricsModule,
    TypeOrmModule.forRootAsync({
      dataSourceFactory: async (options: DataSourceOptions) => {
        return new DataSource(options).initialize();
      },
      useClass: TypeOrmConfigService,
    }),
    ArticlesModule,
    MoviesModule,
    HealthModule,
    UsersModule,
    AuthModule,
    SessionsModule,
    MailerModule,
    GeolocationModule,
  ],
  providers: [],
})
export class AppModule {}
