import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  SetMetadata,
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
import { UpdateApplicationDto } from './dto/update-application.dto';
import OfferOwnerGuard from 'src/auth/offer-owner-guard';
import { OwnerResource } from 'src/auth/owner-resource';

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
  @Roles(Role.CANDIDATE)
  async findAllByUserId(@LoggedInUser() loggedInUser: User) {
    return await this.applicationsService.findByUserId(loggedInUser.id);
  }

  @Get('offer/:id')
  @Roles(Role.RECRUITER)
  @UseGuards(OfferOwnerGuard)
  @SetMetadata('id', OwnerResource.OFFER)
  async findAllByOfferId(@Param('id') id: string) {
    return await this.applicationsService.findByOfferId(id);
  }

  @Patch(':id')
  @Roles(Role.RECRUITER)
  @UseGuards(OfferOwnerGuard)
  @SetMetadata('id', OwnerResource.APPLICATION)
  async update(
    @Param('id') id: string,
    @Body(ValidationPipe) dto: UpdateApplicationDto,
  ) {
    try {
      return await this.applicationsService.update(id, dto);
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
