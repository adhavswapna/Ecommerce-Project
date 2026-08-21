import { Request, Response } from "express";

import {
  addItem,
  getUserItems,
  updateItemQuantity,
  removeItem,
  clearUserItems,
  moveWishlistToCart,
  moveCartToWishlist,
} from "../services/cart.service";

/*
 * ======================================================
 * ADD TO CART
 * ======================================================
 */

export async function addItemController(
  req: Request,
  res: Response
) {
  try {
    const userId = (req as any).user?.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const {
      productId,
      quantity = 1,
      price,
    } = req.body;

    if (!productId) {
      return res.status(400).json({
        message: "productId is required",
      });
    }

    const numericQuantity = Number(quantity);
    const numericPrice = Number(price);

    if (
      !Number.isFinite(numericQuantity) ||
      numericQuantity <= 0
    ) {
      return res.status(400).json({
        message: "quantity must be greater than 0",
      });
    }

    if (
      price === undefined ||
      price === null ||
      !Number.isFinite(numericPrice) ||
      numericPrice < 0
    ) {
      return res.status(400).json({
        message: "Valid price is required",
      });
    }

    const item = await addItem(
      String(userId),
      String(productId),
      numericQuantity,
      numericPrice,
      "CART"
    );

    return res.status(201).json(item);
  } catch (error) {
    console.error(
      "❌ Error adding item to cart:",
      error
    );

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

/*
 * ======================================================
 * ADD TO WISHLIST
 * ======================================================
 */

export async function addToWishlist(
  req: Request,
  res: Response
) {
  try {
    const userId = (req as any).user?.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const {
      productId,
      quantity = 1,
      price = 0,
    } = req.body;

    if (!productId) {
      return res.status(400).json({
        message: "productId is required",
      });
    }

    const numericQuantity = Number(quantity);
    const numericPrice = Number(price);

    if (
      !Number.isFinite(numericQuantity) ||
      numericQuantity <= 0
    ) {
      return res.status(400).json({
        message: "quantity must be greater than 0",
      });
    }

    if (
      !Number.isFinite(numericPrice) ||
      numericPrice < 0
    ) {
      return res.status(400).json({
        message: "Valid price is required",
      });
    }

    const item = await addItem(
      String(userId),
      String(productId),
      numericQuantity,
      numericPrice,
      "WISHLIST"
    );

    return res.status(201).json(item);
  } catch (error) {
    console.error(
      "❌ Error adding to wishlist:",
      error
    );

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

/*
 * ======================================================
 * GET CART
 * ======================================================
 */

export async function getCartItems(
  req: Request,
  res: Response
) {
  try {
    const userId = (req as any).user?.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const items = await getUserItems(
      String(userId),
      "CART"
    );

    return res.status(200).json(items);
  } catch (error) {
    console.error(
      "❌ Error fetching cart:",
      error
    );

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

/*
 * ======================================================
 * GET WISHLIST
 * ======================================================
 */

export async function getWishlistItems(
  req: Request,
  res: Response
) {
  try {
    const userId = (req as any).user?.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const items = await getUserItems(
      String(userId),
      "WISHLIST"
    );

    return res.status(200).json(items);
  } catch (error) {
    console.error(
      "❌ Error fetching wishlist:",
      error
    );

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

/*
 * ======================================================
 * UPDATE ITEM
 * ======================================================
 */

export async function updateItem(
  req: Request,
  res: Response
) {
  try {
    const userId = (req as any).user?.userId;
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    if (!itemId) {
      return res.status(400).json({
        message: "itemId is required",
      });
    }

    const numericQuantity = Number(quantity);

    if (
      !Number.isFinite(numericQuantity) ||
      numericQuantity <= 0
    ) {
      return res.status(400).json({
        message: "quantity must be greater than 0",
      });
    }

    const item = await updateItemQuantity(
      itemId,
      numericQuantity,
      String(userId)
    );

    return res.status(200).json(item);
  } catch (error) {
    console.error(
      "❌ Error updating item:",
      error
    );

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

/*
 * ======================================================
 * REMOVE ITEM
 * ======================================================
 */

export async function removeItemController(
  req: Request,
  res: Response
) {
  try {
    const userId = (req as any).user?.userId;
    const { itemId } = req.params;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    if (!itemId) {
      return res.status(400).json({
        message: "itemId is required",
      });
    }

    const item = await removeItem(
      itemId,
      String(userId)
    );

    return res.status(200).json({
      message: "Item removed",
      item,
    });
  } catch (error) {
    console.error(
      "❌ Error removing item:",
      error
    );

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

/*
 * ======================================================
 * CLEAR CART
 * ======================================================
 */

export async function clearItems(
  req: Request,
  res: Response
) {
  try {
    const userId = (req as any).user?.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    await clearUserItems(
      String(userId),
      "CART"
    );

    return res.status(200).json({
      message: "Cart cleared",
    });
  } catch (error) {
    console.error(
      "❌ Error clearing cart:",
      error
    );

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

/*
 * ======================================================
 * CLEAR WISHLIST
 * ======================================================
 */

export async function clearWishlist(
  req: Request,
  res: Response
) {
  try {
    const userId = (req as any).user?.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    await clearUserItems(
      String(userId),
      "WISHLIST"
    );

    return res.status(200).json({
      message: "Wishlist cleared",
    });
  } catch (error) {
    console.error(
      "❌ Error clearing wishlist:",
      error
    );

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

/*
 * ======================================================
 * MOVE CART → WISHLIST
 * ======================================================
 */

export async function moveItemToWishlist(
  req: Request,
  res: Response
) {
  try {
    const userId = (req as any).user?.userId;
    const { itemId } = req.params;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    if (!itemId) {
      return res.status(400).json({
        message: "itemId is required",
      });
    }

    const item = await moveCartToWishlist(
      itemId,
      String(userId)
    );

    return res.status(200).json(item);
  } catch (error) {
    console.error(
      "❌ Error moving item to wishlist:",
      error
    );

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

/*
 * ======================================================
 * MOVE WISHLIST → CART
 * ======================================================
 */

export async function moveItemToCart(
  req: Request,
  res: Response
) {
  try {
    const userId = (req as any).user?.userId;
    const { itemId } = req.params;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    if (!itemId) {
      return res.status(400).json({
        message: "itemId is required",
      });
    }

    const item = await moveWishlistToCart(
      itemId,
      String(userId)
    );

    return res.status(200).json(item);
  } catch (error) {
    console.error(
      "❌ Error moving item to cart:",
      error
    );

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}
