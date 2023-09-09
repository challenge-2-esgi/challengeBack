import { Module } from '@nestjs/common';
import { AzureBlobService } from 'src/azure-blob/azure-blob.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';

@Module({
  controllers: [CompanyController],
  providers: [CompanyService, PrismaService, AzureBlobService],
  exports: [CompanyService],
})
export class CompanyModule {}
