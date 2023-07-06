import { Injectable } from '@nestjs/common';
import { CreateJobOfferDto } from './dto/create-job-offer.dto';
import { UpdateJobOfferDto } from './dto/update-job-offer.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { skip } from 'rxjs';
import { ContractType, Experience } from '@prisma/client';
import { JobOfferSearchService } from './job-offer-search.service';

@Injectable()
export class JobOfferService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jobOfferSearchService: JobOfferSearchService,
  ) {}

  async create(dto: CreateJobOfferDto) {
    const jobOffer = await this.prisma.jobOffer.create({
      data: {
        ...dto,
        startDate: new Date(dto.startDate),
      },
    });

    console.log('jobOffer', jobOffer);

    const jobOfferSearch = await this.jobOfferSearchService.indexPost(jobOffer);

    console.log('jobOfferSearch', jobOfferSearch);
    return jobOffer;
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    contractType?: ContractType;
    experience?: Experience;
    search: string;
  }) {
    const { skip, take, contractType, experience, search } = params;

    if (search) {
      const results = await this.jobOfferSearchService.search(search);
      const ids = results.map((result: any) => result.id);
      if (!ids.length) {
        return [];
      }
      return this.prisma.jobOffer.findMany({
        where: {
          id: {
            in: ids,
          },
          ...(contractType != null && { contractType: contractType }),
          ...(experience != null && { experience: experience }),
        },
        skip: skip ? parseInt(skip.toString()) : undefined,
        take: take ? parseInt(take.toString()) : undefined,
        include: {
          company: {
            include: {
              address: true,
            },
          },
        },
      });
    }

    return this.prisma.jobOffer.findMany({
      skip: skip ? parseInt(skip.toString()) : undefined,
      take: take ? parseInt(take.toString()) : undefined,
      where: {
        ...(contractType != null && { contractType: contractType }),
        ...(experience != null && { experience: experience }),
      },
      include: {
        company: {
          include: {
            address: true,
          },
        },
      },
    });
  }

  findOne(id: string) {
    return this.prisma.jobOffer.findUniqueOrThrow({
      where: {
        id: id,
      },
      include: {
        company: {
          include: {
            address: true,
          },
        },
      },
    });
  }

  async searchJobOffers(search: string) {
    const results = await this.jobOfferSearchService.search(search);
    const ids = results.map((result: any) => result.id);
    if (!ids.length) {
      return [];
    }
    return this.prisma.jobOffer.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }

  update(id: string, dto: UpdateJobOfferDto) {
    return this.prisma.jobOffer.update({
      where: {
        id: id,
      },
      data: {
        ...dto,
        ...(dto.startDate != null && { startDate: new Date(dto.startDate) }),
      },
    });
  }

  remove(id: string) {
    return this.prisma.jobOffer.delete({
      where: {
        id: id,
      },
    });
  }
}
