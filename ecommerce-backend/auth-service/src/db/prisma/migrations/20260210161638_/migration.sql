-- AlterTable
ALTER TABLE "AuthUser" ADD COLUMN     "name" TEXT;

-- CreateIndex
CREATE INDEX "AuthUser_email_idx" ON "AuthUser"("email");

-- CreateIndex
CREATE INDEX "AuthUser_role_idx" ON "AuthUser"("role");
