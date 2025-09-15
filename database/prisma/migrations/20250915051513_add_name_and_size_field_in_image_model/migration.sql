/*
  Warnings:

  - Added the required column `name` to the `Image` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size` to the `Image` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Image` ADD COLUMN `name` VARCHAR(250) NOT NULL,
    ADD COLUMN `size` INTEGER NOT NULL;
