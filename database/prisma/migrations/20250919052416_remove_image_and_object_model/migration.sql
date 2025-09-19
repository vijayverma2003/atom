/*
  Warnings:

  - You are about to drop the `Image` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Object` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Image` DROP FOREIGN KEY `Image_objectId_fkey`;

-- DropForeignKey
ALTER TABLE `Object` DROP FOREIGN KEY `Object_userId_fkey`;

-- DropTable
DROP TABLE `Image`;

-- DropTable
DROP TABLE `Object`;
