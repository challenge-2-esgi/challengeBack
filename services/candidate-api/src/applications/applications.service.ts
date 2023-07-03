import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class ApplicationsService {
  constructor(private prisma: PrismaClient) {}

  async create(createApplicationDto: CreateApplicationDto) {
    return await this.prisma.application.create({
      data: {
        userId: createApplicationDto.userId,
        offerId: createApplicationDto.offerId,
        motivation: createApplicationDto.motivation,
        cv: createApplicationDto.cv
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