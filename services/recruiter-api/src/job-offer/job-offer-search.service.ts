import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JobOffer } from '@prisma/client';
import { ElasticsearchService } from '@nestjs/elasticsearch';

interface JobOfferSearchBody {
  id: string;
  title: string;
  description: string;
}

interface JobOfferSearchResult {
  hits: {
    total: number;
    hits: Array<{
      _source: JobOfferSearchBody;
    }>;
  };
}
@Injectable()
export class JobOfferSearchService {
  index = 'job-offer';

  constructor(
    private readonly prisma: PrismaService,
    private readonly elasticsearchService: ElasticsearchService,
  ) {}

  async indexPost(jobOffer: JobOffer) {
    return this.elasticsearchService.index<JobOfferSearchBody>({
      index: this.index,
      body: {
        id: jobOffer.id,
        title: jobOffer.title,
        description: jobOffer.description,
      },
    });
  }

  async search(text: string) {
    console.log('searching', text);
    const res = await this.elasticsearchService.search<JobOfferSearchResult>({
      index: this.index,
      body: {
        query: {
          multi_match: {
            query: text,
            fields: ['title', 'description'],
          },
        },
      },
    });
    const hits = res.hits.hits;
    return hits.map((item) => item._source);
  }
}
