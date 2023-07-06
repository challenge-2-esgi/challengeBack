import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule } from '@nestjs/microservices';
import { AzureBlobService } from './azure-blob/azure-blob.service';
import { CompanyModule } from './company/company.module';
import { Services, authService, candidateService } from './config/tcpOptions';
import validationSchema from './config/validation';
import { JobOfferModule } from './job-offer/job-offer.module';
import { PrismaService } from './prisma/prisma.service';

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
        {
          inject: [ConfigService],
          name: Services.CANDIDATE_SERVICE,
          useFactory: (configService: ConfigService) =>
            candidateService(configService),
        },
      ],
    }),
    CompanyModule,
    JobOfferModule,
  ],
  providers: [PrismaService, AzureBlobService],
})
export class AppModule {}
