/*
  Warnings:

  - Added the required column `trackingId` to the `Shipment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Shipment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Shipment" ADD COLUMN     "trackingId" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'CREATED';
