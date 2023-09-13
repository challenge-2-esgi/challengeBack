import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CompanyModule } from 'src/company/company.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { JobOfferController } from './job-offer.controller';
import { JobOfferService } from './job-offer.service';
import { MsJobOfferController } from './ms.job-offer.controller';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { JobOfferSearchService } from './job-offer-search.service';

@Module({
  imports: [
    ConfigModule,
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        node: configService.get('ELASTICSEARCH_NODE'),
        auth: {
          username: configService.get('ELASTICSEARCH_USERNAME'),
          password: configService.get('ELASTICSEARCH_PASSWORD'),
        },
      }),
      inject: [ConfigService],
    }),
    CompanyModule,
  ],
  exports: [ElasticsearchModule],
  controllers: [JobOfferController, MsJobOfferController],
  providers: [JobOfferService, PrismaService, JobOfferSearchService],
})
export class JobOfferModule {}
