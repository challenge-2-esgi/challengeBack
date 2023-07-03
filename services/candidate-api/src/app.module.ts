import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import validationSchema from './config/validation';
import { ClientsModule } from '@nestjs/microservices';
import { Services, authService } from './config/tcpOptions';
import { ApplicationsModule } from './applications/applications.module';
import { BookmarksModule } from './bookmarks/bookmarks.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: process.env.NODE_ENV === 'prod',
      validationSchema: validationSchema,
    }),
    ClientsModule.registerAsync({
      isGlobal: true,
      clients: [
        {
          inject: [ConfigService],
          name: Services.AUTH_SERVICE,
          useFactory: (configService: ConfigService) =>
            authService(configService),
        },
      ],
    }),
    ApplicationsModule,
    BookmarksModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
