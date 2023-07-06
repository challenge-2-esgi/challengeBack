/*
  Warnings:

  - A unique constraint covering the columns `[userId,offerId]` on the table `Application` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[offerId,userId]` on the table `Bookmark` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Application_userId_offerId_key" ON "Application"("userId", "offerId");

-- CreateIndex
CREATE UNIQUE INDEX "Bookmark_offerId_userId_key" ON "Bookmark"("offerId", "userId");
