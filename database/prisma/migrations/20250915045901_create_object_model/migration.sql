/*
  Warnings:

  - You are about to drop the column `description` on the `Image` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Image` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Image` table. All the data in the column will be lost.
  - Added the required column `height` to the `Image` table without a default value. This is not possible if the table is not empty.
  - Added the required column `objectId` to the `Image` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Image` table without a default value. This is not possible if the table is not empty.
  - Added the required column `width` to the `Image` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Image` DROP FOREIGN KEY `Image_userId_fkey`;

-- DropIndex
DROP INDEX `Image_userId_fkey` ON `Image`;

-- AlterTable
ALTER TABLE `Image` DROP COLUMN `description`,
    DROP COLUMN `title`,
    DROP COLUMN `userId`,
    ADD COLUMN `height` INTEGER NOT NULL,
    ADD COLUMN `objectId` VARCHAR(191) NOT NULL,
    ADD COLUMN `type` VARCHAR(191) NOT NULL,
    ADD COLUMN `width` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `Object` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(250) NOT NULL,
    `description` VARCHAR(1000) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Image` ADD CONSTRAINT `Image_objectId_fkey` FOREIGN KEY (`objectId`) REFERENCES `Object`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Object` ADD CONSTRAINT `Object_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
