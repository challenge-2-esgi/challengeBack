import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PrismaClient } from '@prisma/client';
import {
  AccessType,
  AzureBlobService,
} from 'src/azure-blob/azure-blob.service';
import { Services } from 'src/config/tcpOptions';
import { CreateApplicationDto } from './dto/create-application.dto';
import { firstValueFrom, timeout } from 'rxjs';
import { UpdateApplicationDto } from './dto/update-application.dto';

@Injectable()
export class ApplicationsService {
  constructor(
    private prisma: PrismaClient,
    private azureBlobService: AzureBlobService,
    @Inject(Services.AUTH_SERVICE) private readonly authProxy: ClientProxy,
    @Inject(Services.RECRUITER_SERVICE)
    private readonly recruiterProxy: ClientProxy,
  ) {}

  async create(
    createApplicationDto: CreateApplicationDto,
    userId: string,
    file: Express.Multer.File | null,
  ) {
    let fileUrl = '';
    if (file != null) {
      fileUrl = await this.azureBlobService.uploadFile(
        file,
        AccessType.PRIVATE,
      );
    }

    return await this.prisma.application.create({
      data: {
        userId: userId,
        offerId: createApplicationDto.offerId,
        motivation: createApplicationDto.motivation,
        cv: this.azureBlobService.getFileNameFromUrl(fileUrl),
      },
    });
  }

  async findOne(id: string) {
    const application = await this.prisma.application.findUnique({
      where: {
        id,
      },
    });
    if (!application) {
      throw new NotFoundException('Application not found');
    }
    return application;
  }

  async findByUserId(userId: string) {
    const applications = await this.prisma.application.findMany({
      where: {
        userId,
      },
    });

    let jobOffers = [];
    if (applications.length > 0) {
      try {
        jobOffers = await firstValueFrom(
          this.recruiterProxy
            .send('recruiter-findJobOffersByIds', {
              offerIds: applications.map((application) => application.offerId),
            })
            .pipe(timeout(5000)),
        );
      } catch (error) {}

      if (jobOffers != null && jobOffers.length > 0) {
        return applications.map((application) => {
          const { offerId, ...applicationWithoutOfferId } = application;

          return {
            ...applicationWithoutOfferId,
            jobOffer:
              jobOffers.find((offer) => offer.id === application.offerId) ??
              null,
          };
        });
      }
    }

    return applications;
  }

  async findByOfferId(offerId: string) {
    const applications = await this.prisma.application.findMany({
      where: {
        offerId,
      },
    });

    let users = [];
    try {
      users = await firstValueFrom(
        this.authProxy
          .send('auth-findUsersByIds', {
            userIds: applications.map((application) => application.userId),
          })
          .pipe(timeout(5000)),
      );
    } catch (error) {}

    if (users != null && users.length > 0) {
      return applications.map((application) => {
        const { userId, ...applicationWithoutUserId } = application;
        return {
          ...applicationWithoutUserId,
          candidate:
            users.find((user) => user.id === application.userId) ?? null,
        };
      });
    }

    return applications;
  }

  async findByResumeId(id: string) {
    return await this.prisma.application.findFirst({
      where: {
        cv: id,
      },
    });
  }

  async findResume(id: string) {
    return await this.azureBlobService.downloadFile(id);
  }

  async update(id: string, dto: UpdateApplicationDto) {
    return await this.prisma.application.update({
      where: {
        id: id,
      },
      data: {
        status: dto.status,
      },
    });
  }
}
