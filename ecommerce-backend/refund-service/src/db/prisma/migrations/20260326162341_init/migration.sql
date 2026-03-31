/*
  Warnings:

  - The primary key for the `Refund` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `amount` to the `Refund` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentId` to the `Refund` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Refund" DROP CONSTRAINT "Refund_pkey",
ADD COLUMN     "amount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "paymentId" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "orderId" SET DATA TYPE TEXT,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Refund_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Refund_id_seq";

-- CreateIndex
CREATE INDEX "Refund_orderId_idx" ON "Refund"("orderId");

-- CreateIndex
CREATE INDEX "Refund_userId_idx" ON "Refund"("userId");
