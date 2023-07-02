import { Injectable } from '@nestjs/common';
import { CreateJobOfferDto } from './dto/create-job-offer.dto';
import { UpdateJobOfferDto } from './dto/update-job-offer.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JobOfferService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateJobOfferDto) {
    return this.prisma.jobOffer.create({
      data: {
        ...dto,
        startDate: new Date(dto.startDate),
      },
    });
  }

  findAll() {
    return this.prisma.jobOffer.findMany({
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
