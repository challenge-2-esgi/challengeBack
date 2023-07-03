import { Module } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { ApplicationsController } from './applications.controller';
import { PrismaClient } from '@prisma/client';

@Module({
  controllers: [ApplicationsController],
  providers: [ApplicationsService, PrismaClient]
})
export class ApplicationsModule {}
