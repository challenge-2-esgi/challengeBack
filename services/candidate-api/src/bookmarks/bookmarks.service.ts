import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { UpdateBookmarkDto } from './dto/update-bookmark.dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class BookmarksService {
  constructor(private prisma: PrismaClient) {}

  async create(createBookmarkDto: CreateBookmarkDto) {
    return await this.prisma.bookmark.create({
      data: {
        userId: createBookmarkDto.userId,
        offerId: createBookmarkDto.offerId,
      },
    });
  }

  async findAll() {
    return await this.prisma.bookmark.findMany();
  }

  async findOne(id: string) {
    const bookmark = await this.prisma.bookmark.findUnique({
      where: {
        id,
      },
    });
    if (!bookmark) {
      throw new NotFoundException('Bookmark not found');
    }
    return bookmark;
  }

  async findByUserId(userId: string) {
    const bookmarks = await this.prisma.bookmark.findMany({
      where: {
        userId,
      },
    });
    if (!bookmarks) {
      throw new NotFoundException('Bookmarks not found given user');
    }
    return bookmarks;
  }

  async update(id: string, updateBookmarkDto: UpdateBookmarkDto) {
    const bookmark = await this.findOne(id);
    return await this.prisma.bookmark.update({
      where: {
        id,
      },
      data: {
        offerId: updateBookmarkDto.offerId,
        userId: updateBookmarkDto.userId,
      },
    });
  }

  async remove(id: string) {
    const bookmark = await this.findOne(id);
    return await this.prisma.bookmark.delete({
      where: {
        id,
      },
    });
  }
}
