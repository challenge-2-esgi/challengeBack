import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { AzureBlobService } from 'src/azure-blob/azure-blob.service';
import { CreateApplicationDto } from './dto/create-application.dto';

@Injectable()
export class ApplicationsService {
  constructor(
    private prisma: PrismaClient,
    private azureBlobService: AzureBlobService,
  ) {}

  async create(
    createApplicationDto: CreateApplicationDto,
    userId: string,
    file: Express.Multer.File | null,
  ) {
    let fileUrl = '';
    // if (file != null) {
    //   fileUrl = await this.azureBlobService.uploadFile(file, AccessType.PUBLIC);
    // }

    return await this.prisma.application.create({
      data: {
        userId: userId,
        offerId: createApplicationDto.offerId,
        motivation: createApplicationDto.motivation,
        cv: fileUrl,
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
    if (!applications) {
      throw new NotFoundException('Applications not found given user');
    }
    return applications;
  }
}
