import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UnprocessableEntityException,
  UploadedFile,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { ApplicationsParseFileFieldsPipe } from './applications-parse-file.pipe';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';

@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @UploadedFile(ApplicationsParseFileFieldsPipe)
    file: Express.Multer.File | null,
    @Body(ValidationPipe) createApplicationDto: CreateApplicationDto,
  ) {
    let application = null;
    try {
      application = await this.applicationsService.create(
        createApplicationDto,
        file,
      );
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException();
      }
      throw new UnprocessableEntityException();
    }
    return application;
  }

  @Get()
  async findAll() {
    return await this.applicationsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.applicationsService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateApplicationDto: UpdateApplicationDto,
  ) {
    return await this.applicationsService.update(id, updateApplicationDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.applicationsService.remove(id);
  }

  @Get('/user/:id')
  async findByUserId(@Param('id') id: string) {
    return await this.applicationsService.findByUserId(id);
  }
}
