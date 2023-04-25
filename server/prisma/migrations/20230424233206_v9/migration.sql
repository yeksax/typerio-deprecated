/*
  Warnings:

  - You are about to drop the column `displayId` on the `Group` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id]` on the table `Group` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Group_displayId_key";

-- AlterTable
ALTER TABLE "Group" DROP COLUMN "displayId";

-- CreateIndex
CREATE UNIQUE INDEX "Group_id_key" ON "Group"("id");
