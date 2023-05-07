/*
  Warnings:

  - You are about to drop the column `preferences` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `preferencesId` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "User_preferencesId_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "preferences",
DROP COLUMN "preferencesId";
