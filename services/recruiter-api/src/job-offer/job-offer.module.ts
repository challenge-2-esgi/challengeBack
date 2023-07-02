import { Module } from '@nestjs/common';
import { JobOfferService } from './job-offer.service';
import { JobOfferController } from './job-offer.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [JobOfferController],
  providers: [JobOfferService, PrismaService],
})
export class JobOfferModule {}
