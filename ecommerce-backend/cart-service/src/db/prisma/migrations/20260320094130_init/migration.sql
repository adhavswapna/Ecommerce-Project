-- CreateEnum
CREATE TYPE "CartItemType" AS ENUM ('CART', 'WISHLIST');

-- AlterTable
ALTER TABLE "CartItem" ADD COLUMN     "type" "CartItemType" NOT NULL DEFAULT 'CART';
