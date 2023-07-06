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
  ValidationPipe,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { BookmarksService } from './bookmarks.service';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { UpdateBookmarkDto } from './dto/update-bookmark.dto';

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

  @Get()
  async findAll() {
    return await this.bookmarksService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.bookmarksService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateBookmarkDto: UpdateBookmarkDto,
  ) {
    return await this.bookmarksService.update(id, updateBookmarkDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.bookmarksService.remove(id);
  }

  @Get('/user/:id')
  async findByUserId(@Param('id') id: string) {
    return await this.bookmarksService.findByUserId(id);
  }
}
