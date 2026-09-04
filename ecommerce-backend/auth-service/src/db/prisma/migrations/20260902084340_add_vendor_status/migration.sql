-- CreateEnum
CREATE TYPE "VendorStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "AuthUser" ADD COLUMN     "vendorStatus" "VendorStatus";

-- CreateIndex
CREATE INDEX "AuthUser_role_idx" ON "AuthUser"("role");

-- CreateIndex
CREATE INDEX "AuthUser_vendorStatus_idx" ON "AuthUser"("vendorStatus");
