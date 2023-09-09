import {
  Body,
  ConflictException,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Post,
  UnprocessableEntityException,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { BookmarksService } from './bookmarks.service';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import JwtAuthGuard from 'src/auth/jwt-guard';
import RoleGuard from 'src/auth/role-guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/roles';
import { LoggedInUser } from 'src/auth/logged-in-user.decorator';
import { User } from 'src/auth/user';

@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('bookmarks')
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {}

  @Post()
  @Roles(Role.CANDIDATE)
  async create(
    @Body(ValidationPipe) createBookmarkDto: CreateBookmarkDto,
    @LoggedInUser() loggedInUser: User,
  ) {
    try {
      return await this.bookmarksService.create(
        loggedInUser.id,
        createBookmarkDto.offerId,
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
  }

  @Get()
  @Roles(Role.CANDIDATE)
  async findByUserId(@LoggedInUser() loggedInUser: User) {
    return await this.bookmarksService.findByUserId(loggedInUser.id);
  }

  @Delete(':id')
  @Roles(Role.CANDIDATE)
  async remove(@Param('id') id: string) {
    return await this.bookmarksService.remove(id);
  }
}
