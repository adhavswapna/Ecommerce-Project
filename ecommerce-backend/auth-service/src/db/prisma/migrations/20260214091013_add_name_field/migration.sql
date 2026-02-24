-- AlterTable
ALTER TABLE "AuthUser" ADD COLUMN     "address" TEXT,
ADD COLUMN     "name" TEXT,
ADD COLUMN     "phone" TEXT,
ALTER COLUMN "role" SET DEFAULT 'USER';

-- CreateIndex
CREATE INDEX "AuthUser_email_idx" ON "AuthUser"("email");
