import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { PrismaClient } from '@prisma/client';
import { AccessType, AzureBlobService } from 'src/azure-blob/azure-blob.service';

@Injectable()
export class ApplicationsService {
  constructor(private prisma: PrismaClient, private azureBlobService: AzureBlobService) {}

  async create(createApplicationDto: CreateApplicationDto, file: Express.Multer.File | null) {
    let fileUrl = null;
    if (file != null) {
      fileUrl = await this.azureBlobService.uploadFile(file, AccessType.PUBLIC);
    }
    
    return await this.prisma.application.create({
      data: {
        userId: createApplicationDto.userId,
        offerId: createApplicationDto.offerId,
        motivation: createApplicationDto.motivation,
        cv: fileUrl
      }
    });
  }

  async findAll() {
    return await this.prisma.application.findMany();
  }

  async findOne(id: string) {
    const application = await this.prisma.application.findUnique({
      where: {
        id
      }
    });
    if (!application) {
      throw new NotFoundException('Application not found')
    }
    return application;
  }

  async findByUserId(userId: string) {
    const applications = await this.prisma.application.findMany({
      where: {
        userId
      }
    });
    if (!applications) {
      throw new NotFoundException('Applications not found given user')
    }
    return applications;
  }

  async update(id: string, UpdateApplicationDto: UpdateApplicationDto) {
    const application = await this.findOne(id);
    return await this.prisma.application.update({
      where: {
        id
      },
      data: {
        status: UpdateApplicationDto.status
      }
    })
  }

  async remove(id: string) {
    const application = await this.findOne(id);
    return await this.prisma.application.delete({
      where: {
        id
      }
    })
  }
}