import { Module } from '@nestjs/common';
import { CompanyModule } from './company/company.module';
import { PrismaService } from './prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { AzureBlobService } from './azure-blob/azure-blob.service';
import validationSchema from './config/validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: process.env.NODE_ENV === 'prod',
      validationSchema: validationSchema,
    }),
    CompanyModule,
  ],
  providers: [PrismaService, AzureBlobService],
})
export class AppModule {}
