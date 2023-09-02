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
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { ApplicationsParseFileFieldsPipe } from './applications-parse-file.pipe';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import JwtAuthGuard from 'src/auth/jwt-guard';
import RoleGuard from 'src/auth/role-guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/roles';
import { LoggedInUser } from 'src/auth/logged-in-user.decorator';
import { User } from 'src/auth/user';

// TODO: find applications by offer id
// TODO: remove unused endpoints

@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post()
  @Roles(Role.CANDIDATE)
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @UploadedFile(ApplicationsParseFileFieldsPipe)
    file: Express.Multer.File | null,
    @Body(ValidationPipe) createApplicationDto: CreateApplicationDto,
    @LoggedInUser() loggedInUser: User,
  ) {
    let application = null;
    try {
      application = await this.applicationsService.create(
        createApplicationDto,
        loggedInUser.id,
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

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.applicationsService.findOne(id);
  }

  @Get()
  async findByUserId(@LoggedInUser() loggedInUser: User) {
    return await this.applicationsService.findByUserId(loggedInUser.id);
  }

  @Get()
  async findAll() {
    return await this.applicationsService.findAll();
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
}
