import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApplicationsParseFileFieldsPipe } from './applications-parse-file.pipe';

@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Body(ValidationPipe) createApplicationDto: CreateApplicationDto,
    @UploadedFile(ApplicationsParseFileFieldsPipe) file?: Express.Multer.File | null
  ) {
    return await this.applicationsService.create(createApplicationDto, file);
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
  async update(@Param('id') id: string, @Body(ValidationPipe) updateApplicationDto: UpdateApplicationDto) {
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
