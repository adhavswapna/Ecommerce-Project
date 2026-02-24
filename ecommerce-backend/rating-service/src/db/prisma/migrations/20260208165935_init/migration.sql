/*
  Warnings:

  - You are about to drop the `AnalyticsEvent` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "AnalyticsEvent";

-- CreateTable
CREATE TABLE "Rating" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Rating_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Rating_productId_idx" ON "Rating"("productId");

-- CreateIndex
CREATE INDEX "Rating_userId_idx" ON "Rating"("userId");
