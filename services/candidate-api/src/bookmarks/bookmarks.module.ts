import { Module } from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';
import { BookmarksController } from './bookmarks.controller';
import { PrismaClient } from '@prisma/client';

@Module({
  controllers: [BookmarksController],
  providers: [BookmarksService, PrismaClient]
})
export class BookmarksModule {}
