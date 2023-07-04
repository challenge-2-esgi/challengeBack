import { Module } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { ApplicationsController } from './applications.controller';
import { PrismaClient } from '@prisma/client';
import { AzureBlobService } from 'src/azure-blob/azure-blob.service';

@Module({
  controllers: [ApplicationsController],
  providers: [ApplicationsService, PrismaClient, AzureBlobService]
})
export class ApplicationsModule {}
