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
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import JwtAuthGuard from 'src/auth/jwt-guard';
import { CompanyParseFileFieldsPipe } from './company-parse-file-fields.pipe';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/roles';
import { LoggedInUser } from 'src/auth/logged-in-user.decorator';
import { User } from 'src/auth/user';
import RoleGuard from 'src/auth/role-guard';

// TODO: check if owner

@Controller('companies')
export class CompanyController {
  constructor(private readonly companiesService: CompanyService) {}

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Post()
  @Roles(Role.RECRUITER)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'logo', maxCount: 1 },
      { name: 'images', maxCount: 3 },
    ]),
  )
  async create(
    @UploadedFiles(CompanyParseFileFieldsPipe)
    files: {
      logo?: Express.Multer.File | null;
      images?: Express.Multer.File[] | null;
    },
    @Body() dto: CreateCompanyDto,
    @LoggedInUser() loggedInUser: User,
  ) {
    try {
      return await this.companiesService.create(
        dto,
        loggedInUser.id,
        files.logo,
        files.images,
      );
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

  @Get()
  async findAll() {
    return await this.companiesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.companiesService.findOne(id);
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

  @UseGuards(JwtAuthGuard)
  @Get('owned/current')
  async findLoggedInUserCompany(@LoggedInUser() loggedInUser: User) {
    try {
      return await this.companiesService.findByOwnerId(loggedInUser.id);
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

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'logo', maxCount: 1 },
      { name: 'images', maxCount: 3 },
    ]),
  )
  async update(
    @Param('id') id: string,
    @UploadedFiles(CompanyParseFileFieldsPipe)
    files: {
      logo?: Express.Multer.File | null;
      images?: Express.Multer.File[] | null;
    },
    @Body() dto: UpdateCompanyDto,
  ) {
    try {
      return await this.companiesService.update(
        id,
        dto,
        files.logo,
        files.images,
      );
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

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.companiesService.remove(id);
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException();
      }
      throw new BadRequestException(error);
    }
  }
}
