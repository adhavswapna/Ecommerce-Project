/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "User";

-- DropEnum
DROP TYPE "Role";

-- CreateTable
CREATE TABLE "SearchProduct" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION,
    "vendorId" TEXT,
    "categoryId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SearchProduct_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SearchProduct_name_idx" ON "SearchProduct"("name");

-- CreateIndex
CREATE INDEX "SearchProduct_vendorId_idx" ON "SearchProduct"("vendorId");

-- CreateIndex
CREATE INDEX "SearchProduct_categoryId_idx" ON "SearchProduct"("categoryId");
