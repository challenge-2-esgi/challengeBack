import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UnprocessableEntityException,
  ValidationPipe,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { BookmarksService } from './bookmarks.service';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';

@Controller('bookmarks')
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {}

  @Post()
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
  async findByUserId(@Param('id') id: string) {
    return await this.bookmarksService.findByUserId(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.bookmarksService.remove(id);
  }
}
