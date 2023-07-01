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
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { CompanyParseFileFieldsPipe } from './company-parse-file-fields.pipe';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Controller('companies')
export class CompanyController {
  constructor(private readonly companiesService: CompanyService) {}

  @Post()
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
  ) {
    let company = null;
    try {
      company = await this.companiesService.create(
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
    return company;
  }

  @Get()
  async findAll() {
    return await this.companiesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    let company = null;
    try {
      company = await this.companiesService.findOne(id);
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException();
      }
      throw new BadRequestException();
    }
    return company;
  }

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
    let updatedCompany = null;
    try {
      updatedCompany = await this.companiesService.update(
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
    return updatedCompany;
  }

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
