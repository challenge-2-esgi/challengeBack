import {
  Body,
  ConflictException,
  Controller,
  Delete,
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

@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('bookmarks')
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {}

  @Post()
  @Roles(Role.CANDIDATE)
  async create(@Body(ValidationPipe) createBookmarkDto: CreateBookmarkDto) {
    let bookmark = null;
    try {
      bookmark = await this.bookmarksService.create(createBookmarkDto);
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException();
      }
      throw new UnprocessableEntityException();
    }

    return bookmark;
  }

  @Get('/user/:id')
  @Roles(Role.CANDIDATE)
  async findByUserId(@Param('id') id: string) {
    return await this.bookmarksService.findByUserId(id);
  }

  @Delete(':id')
  @Roles(Role.CANDIDATE)
  async remove(@Param('id') id: string) {
    return await this.bookmarksService.remove(id);
  }
}
