import { PrismaClient } from "@prisma/client";

import {
  publishCartItemAdded,
  publishCartItemRemoved,
  publishCartCleared,
} from "../kafka/cart.producer";

import {
  setCart,
  getCart,
  deleteCart,
} from "../redis/cart.cache";

const prisma = new PrismaClient();

type ItemType = "CART" | "WISHLIST";

/*
 * ======================================================
 * ADD ITEM
 * ======================================================
 */

export async function addItem(
  userId: string,
  productId: string,
  quantity: number,
  price: number,
  type: ItemType = "CART"
) {
  if (!userId) {
    throw new Error("User ID is required");
  }

  if (!productId) {
    throw new Error("Product ID is required");
  }

  if (!Number.isFinite(quantity) || quantity <= 0) {
    throw new Error("Invalid quantity");
  }

  if (!Number.isFinite(price) || price < 0) {
    throw new Error("Invalid price");
  }

  if (type !== "CART" && type !== "WISHLIST") {
    throw new Error("Invalid item type");
  }

  let cart = await prisma.cart.findFirst({
    where: {
      userId,
    },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: {
        userId,
      },
    });
  }

  const existingItem = await prisma.cartItem.findFirst({
    where: {
      cartId: cart.id,
      productId,
      type,
    },
  });

  let item;

  if (existingItem) {
    item = await prisma.cartItem.update({
      where: {
        id: existingItem.id,
      },
      data: {
        quantity: existingItem.quantity + quantity,
        price,
      },
    });
  } else {
    item = await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity,
        price,
        type,
      },
    });
  }

  /*
   * Invalidate Redis cache after modification.
   */
  try {
    await deleteCart(userId);
  } catch (error) {
    console.error(
      "⚠️ Redis cart delete failed:",
      error
    );
  }

  /*
   * Publish event only for normal CART items.
   */
  if (type === "CART") {
    try {
      await publishCartItemAdded({
        userId,
        productId,
        quantity,
        price,
      });
    } catch (error) {
      console.error(
        "⚠️ Failed to publish cart item added event:",
        error
      );
    }
  }

  return item;
}

/*
 * ======================================================
 * GET ITEMS
 * ======================================================
 */

export async function getUserItems(
  userId: string,
  type: ItemType = "CART"
) {
  if (!userId) {
    throw new Error("User ID is required");
  }

  /*
   * Only normal CART uses Redis.
   * Wishlist is always fetched from PostgreSQL.
   */

  if (type === "CART") {
    try {
      const cached = await getCart(userId);

      if (cached) {
        return cached;
      }
    } catch (error) {
      console.error(
        "⚠️ Redis cart read failed, falling back to database:",
        error
      );
    }
  }

  const cart = await prisma.cart.findFirst({
    where: {
      userId,
    },
    include: {
      items: {
        where: {
          type,
        },

        /*
         * IMPORTANT:
         * CartItem does NOT have createdAt.
         *
         * Prisma schema available fields are:
         * id, cartId, productId, quantity, price, type
         *
         * Therefore use id for deterministic ordering.
         */
        orderBy: {
          id: "desc",
        },
      },
    },
  });

  const items = cart?.items ?? [];

  /*
   * Cache only CART.
   */
  if (type === "CART") {
    try {
      await setCart(userId, items);
    } catch (error) {
      console.error(
        "⚠️ Redis cart cache write failed:",
        error
      );
    }
  }

  return items;
}

/*
 * ======================================================
 * UPDATE QUANTITY
 * ======================================================
 */

export async function updateItemQuantity(
  itemId: string,
  quantity: number,
  userId: string
) {
  if (!userId) {
    throw new Error("User ID is required");
  }

  if (!itemId) {
    throw new Error("Item ID is required");
  }

  if (!Number.isFinite(quantity) || quantity <= 0) {
    throw new Error("Quantity must be greater than 0");
  }

  const item = await prisma.cartItem.findFirst({
    where: {
      id: itemId,
      cart: {
        userId,
      },
    },
    include: {
      cart: true,
    },
  });

  if (!item) {
    throw new Error("Cart item not found");
  }

  const updatedItem = await prisma.cartItem.update({
    where: {
      id: itemId,
    },
    data: {
      quantity,
    },
    include: {
      cart: true,
    },
  });

  try {
    await deleteCart(updatedItem.cart.userId);
  } catch (error) {
    console.error(
      "⚠️ Redis cart delete failed:",
      error
    );
  }

  return updatedItem;
}

/*
 * ======================================================
 * REMOVE ITEM
 * ======================================================
 */

export async function removeItem(
  itemId: string,
  userId: string
) {
  if (!userId) {
    throw new Error("User ID is required");
  }

  if (!itemId) {
    throw new Error("Item ID is required");
  }

  const existingItem = await prisma.cartItem.findFirst({
    where: {
      id: itemId,
      cart: {
        userId,
      },
    },
    include: {
      cart: true,
    },
  });

  if (!existingItem) {
    throw new Error("Cart item not found");
  }

  const item = await prisma.cartItem.delete({
    where: {
      id: itemId,
    },
    include: {
      cart: true,
    },
  });

  try {
    await deleteCart(item.cart.userId);
  } catch (error) {
    console.error(
      "⚠️ Redis cart delete failed:",
      error
    );
  }

  if (item.type === "CART") {
    try {
      await publishCartItemRemoved({
        userId: item.cart.userId,
        productId: item.productId,
      });
    } catch (error) {
      console.error(
        "⚠️ Failed to publish cart item removed event:",
        error
      );
    }
  }

  return item;
}

/*
 * ======================================================
 * CLEAR CART / WISHLIST
 * ======================================================
 */

export async function clearUserItems(
  userId: string,
  type: ItemType = "CART"
) {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const cart = await prisma.cart.findFirst({
    where: {
      userId,
    },
  });

  if (!cart) {
    return;
  }

  await prisma.cartItem.deleteMany({
    where: {
      cartId: cart.id,
      type,
    },
  });

  try {
    await deleteCart(userId);
  } catch (error) {
    console.error(
      "⚠️ Redis cart delete failed:",
      error
    );
  }

  if (type === "CART") {
    try {
      await publishCartCleared({
        userId,
      });
    } catch (error) {
      console.error(
        "⚠️ Failed to publish cart cleared event:",
        error
      );
    }
  }
}

/*
 * ======================================================
 * MOVE CART → WISHLIST
 * ======================================================
 */

export async function moveCartToWishlist(
  itemId: string,
  userId: string
) {
  if (!userId) {
    throw new Error("User ID is required");
  }

  if (!itemId) {
    throw new Error("Item ID is required");
  }

  const existing = await prisma.cartItem.findFirst({
    where: {
      id: itemId,
      cart: {
        userId,
      },
    },
    include: {
      cart: true,
    },
  });

  if (!existing) {
    throw new Error("Item not found");
  }

  if (existing.type === "WISHLIST") {
    return existing;
  }

  const item = await prisma.cartItem.update({
    where: {
      id: itemId,
    },
    data: {
      type: "WISHLIST",
    },
    include: {
      cart: true,
    },
  });

  try {
    await deleteCart(item.cart.userId);
  } catch (error) {
    console.error(
      "⚠️ Redis cart delete failed:",
      error
    );
  }

  /*
   * Item was removed from the CART.
   */
  try {
    await publishCartItemRemoved({
      userId: item.cart.userId,
      productId: item.productId,
    });
  } catch (error) {
    console.error(
      "⚠️ Failed to publish cart item removed event:",
      error
    );
  }

  return item;
}

/*
 * ======================================================
 * MOVE WISHLIST → CART
 * ======================================================
 */

export async function moveWishlistToCart(
  itemId: string,
  userId: string
) {
  if (!userId) {
    throw new Error("User ID is required");
  }

  if (!itemId) {
    throw new Error("Item ID is required");
  }

  const existing = await prisma.cartItem.findFirst({
    where: {
      id: itemId,
      cart: {
        userId,
      },
    },
    include: {
      cart: true,
    },
  });

  if (!existing) {
    throw new Error("Item not found");
  }

  if (existing.type === "CART") {
    return existing;
  }

  const item = await prisma.cartItem.update({
    where: {
      id: itemId,
    },
    data: {
      type: "CART",
    },
    include: {
      cart: true,
    },
  });

  try {
    await deleteCart(item.cart.userId);
  } catch (error) {
    console.error(
      "⚠️ Redis cart delete failed:",
      error
    );
  }

  try {
    await publishCartItemAdded({
      userId: item.cart.userId,
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
    });
  } catch (error) {
    console.error(
      "⚠️ Failed to publish cart item added event:",
      error
    );
  }

  return item;
}

/*
 * ======================================================
 * CLEAN SHUTDOWN
 * ======================================================
 */

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
