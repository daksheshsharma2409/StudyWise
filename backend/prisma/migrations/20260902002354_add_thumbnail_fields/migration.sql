/*
  Warnings:

  - Added the required column `publicId` to the `Resource` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Resource" ADD COLUMN     "publicId" TEXT NOT NULL,
ADD COLUMN     "thumbnailUrl" TEXT;
