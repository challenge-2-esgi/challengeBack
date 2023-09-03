import {
  Body,
  ConflictException,
  Controller,
  Get,
  Param,
  Post,
  UnprocessableEntityException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import JwtAuthGuard from 'src/auth/jwt-guard';
import { LoggedInUser } from 'src/auth/logged-in-user.decorator';
import RoleGuard from 'src/auth/role-guard';
import { Role } from 'src/auth/roles';
import { Roles } from 'src/auth/roles.decorator';
import { User } from 'src/auth/user';
import { ApplicationsParseFileFieldsPipe } from './applications-parse-file.pipe';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';

// TODO: find applications by offer id

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

  @Get()
  async findByUserId(@LoggedInUser() loggedInUser: User) {
    return await this.applicationsService.findByUserId(loggedInUser.id);
  }
}
