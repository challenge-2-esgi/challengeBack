import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { JobOfferController } from './job-offer.controller';
import { JobOfferService } from './job-offer.service';

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
  ],
  // exports: [ElasticsearchModule],
  controllers: [JobOfferController],
  providers: [JobOfferService, PrismaService],
})
export class JobOfferModule {}
