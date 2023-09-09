import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class BookmarksService {
  constructor(private prisma: PrismaClient) {}

  async create(userId: string, offerId: string) {
    return await this.prisma.bookmark.create({
      data: {
        userId,
        offerId,
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

  async remove(id: string) {
    const bookmark = await this.findOne(id);
    return await this.prisma.bookmark.delete({
      where: {
        id,
      },
    });
  }
}
