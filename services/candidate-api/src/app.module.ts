import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule } from '@nestjs/microservices';
import { ApplicationsModule } from './applications/applications.module';
import { BookmarksModule } from './bookmarks/bookmarks.module';
import { Services, authService } from './config/tcpOptions';
import validationSchema from './config/validation';

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
    BookmarksModule,
  ],
})
export class AppModule {}
