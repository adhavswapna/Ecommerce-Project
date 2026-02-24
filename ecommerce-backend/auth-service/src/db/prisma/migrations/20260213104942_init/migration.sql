/*
  Warnings:

  - You are about to drop the column `name` on the `AuthUser` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "AuthUser_email_idx";

-- DropIndex
DROP INDEX "AuthUser_role_idx";

-- AlterTable
ALTER TABLE "AuthUser" DROP COLUMN "name",
ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "resetToken" TEXT,
ADD COLUMN     "resetTokenExpiry" TIMESTAMP(3),
ALTER COLUMN "role" DROP DEFAULT;
