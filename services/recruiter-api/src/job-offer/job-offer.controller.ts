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
import JwtAuthGuard from 'src/auth/jwt-guard';
import { LoggedInUser } from 'src/auth/logged-in-user.decorator';
import RoleGuard from 'src/auth/role-guard';
import { Role } from 'src/auth/roles';
import { Roles } from 'src/auth/roles.decorator';
import { User } from 'src/auth/user';
import { CompanyService } from 'src/company/company.service';
import { CreateJobOfferDto } from './dto/create-job-offer.dto';
import { UpdateJobOfferDto } from './dto/update-job-offer.dto';
import { JobOfferService } from './job-offer.service';

@Controller('job-offers')
export class JobOfferController {
  constructor(
    private readonly jobOfferService: JobOfferService,
    private readonly companyService: CompanyService,
  ) {}

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

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('company/current')
  @Roles(Role.RECRUITER)
  async findLoggedInUserJobOffers(@LoggedInUser() loggedInUser: User) {
    // TODO: handle exception
    const company = await this.companyService.findByOwnerId(loggedInUser.id);
    if (company == null) {
      return [];
    }

    return await this.jobOfferService.findAllByCompany(company.id);
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
  // TODO: check if owner
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
  // TODO: check if owner
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
