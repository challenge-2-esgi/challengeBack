import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ContractType, Experience } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { CreateJobOfferDto } from './dto/create-job-offer.dto';
import { UpdateJobOfferDto } from './dto/update-job-offer.dto';
import { JobOfferService } from './job-offer.service';
import JwtAuthGuard from 'src/auth/jwt-guard';
import { Role } from 'src/auth/roles';
import { Roles } from 'src/auth/roles.decorator';
import RoleGuard from 'src/auth/role-guard';

// TODO: check if owner

@Controller('job-offers')
export class JobOfferController {
  constructor(private readonly jobOfferService: JobOfferService) {}

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Post()
  @Roles(Role.RECRUITER)
  async create(@Body() dto: CreateJobOfferDto) {
    return await this.jobOfferService.create(dto);
  }

  @Get('search')
  async search(@Query() query: { search?: string }) {
    const { search } = query;
    let jobOffer = null;
    try {
      jobOffer = await this.jobOfferService.searchJobOffers(search);
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

  @Get()
  async findAll(
    @Query()
    params: {
      skip?: number;
      take?: number;
      contractType?: ContractType;
      experience?: Experience;
      search: string;
    },
  ) {
    return await this.jobOfferService.findAll(params);
  }

  @Get('/company/:companyId')
  async findAllByCompany(@Param('companyId') companyId: string) {
    return await this.jobOfferService.findAllByCompany(companyId);
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

  @UseGuards(JwtAuthGuard)
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

  @UseGuards(JwtAuthGuard)
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
