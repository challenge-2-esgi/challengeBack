import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { JobOfferService } from './job-offer.service';
import { CreateJobOfferDto } from './dto/create-job-offer.dto';
import { UpdateJobOfferDto } from './dto/update-job-offer.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { ContractType, Experience } from '@prisma/client';

@Controller('job-offers')
export class JobOfferController {
  constructor(private readonly jobOfferService: JobOfferService) {}

  @Post()
  async create(@Body() dto: CreateJobOfferDto) {
    return await this.jobOfferService.create(dto);
  }

  @Get()
  async findAll(
    @Query()
    params: {
      skip?: number;
      take?: number;
      contractType?: ContractType;
      experience?: Experience;
    },
  ) {
    return await this.jobOfferService.findAll(params);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    let jobOffer = null;
    try {
      jobOffer = await this.jobOfferService.findOne(id);
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException();
      }
      throw new BadRequestException();
    }

    return jobOffer;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateJobOfferDto) {
    let jobOffer = null;
    try {
      jobOffer = await this.jobOfferService.update(id, dto);
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException();
      }
      throw new BadRequestException();
    }

    return jobOffer;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.jobOfferService.remove(id);
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException();
      }
      throw new BadRequestException();
    }
  }
}
