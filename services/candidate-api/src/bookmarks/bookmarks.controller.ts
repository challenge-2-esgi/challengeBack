import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { UpdateBookmarkDto } from './dto/update-bookmark.dto';

@Controller('bookmarks')
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {}

  @Post()
  async create(@Body() createBookmarkDto: CreateBookmarkDto) {
    return await this.bookmarksService.create(createBookmarkDto);
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
  async update(@Param('id') id: string, @Body() updateBookmarkDto: UpdateBookmarkDto) {
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
