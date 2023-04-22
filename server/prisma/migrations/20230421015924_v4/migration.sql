/*
  Warnings:

  - Added the required column `description` to the `GroupChat` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GroupChat" ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "thumbnail" TEXT NOT NULL DEFAULT '/group.png';
