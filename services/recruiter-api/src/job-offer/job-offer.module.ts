import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CompanyModule } from 'src/company/company.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { JobOfferController } from './job-offer.controller';
import { JobOfferService } from './job-offer.service';
import { MsJobOfferController } from './ms.job-offer.controller';

@Module({
  imports: [
    ConfigModule,
    // ElasticsearchModule.registerAsync({
    //   imports: [ConfigModule],
    //   useFactory: async (configService: ConfigService) => ({
    //     node: configService.get('ELASTICSEARCH_NODE'),
    //     auth: {
    //       username: configService.get('ELASTICSEARCH_USERNAME'),
    //       password: configService.get('ELASTICSEARCH_PASSWORD'),
    //     },
    //   }),
    //   inject: [ConfigService],
    // }),
    CompanyModule,
  ],
  // exports: [ElasticsearchModule],
  controllers: [JobOfferController, MsJobOfferController],
  providers: [JobOfferService, PrismaService],
})
export class JobOfferModule {}
