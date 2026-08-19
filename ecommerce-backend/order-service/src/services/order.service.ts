import { PrismaClient } from "@prisma/client";
import { redis } from "../redis/redis-client";

import {
  publishOrderCreated,
  publishOrderCancelled,
} from "../kafka/order.producer";

const prisma = new PrismaClient();

const USER_ORDERS_CACHE = (
  userId: string
) => `orders:user:${userId}`;

/* =======================================================
   PRODUCT SERVICE URL
======================================================= */

const PRODUCT_SERVICE_URL =
  process.env.PRODUCT_SERVICE_URL ||
  "http://localhost:3003";

/* =======================================================
   PLACE ORDER
======================================================= */

export async function placeOrder(
  userId: string,
  totalAmount: number,
  currency: string,
  paymentMethod: string,
  address: {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    country?: string;
    pincode: string;
    phone?: string;
  },
  items: {
    productId: string;
    quantity: number;
    price: number;
  }[]
) {
  const order =
    await prisma.order.create({
      data: {
        userId,
        totalAmount,
        currency,
        paymentMethod,
        status: "PENDING",

        addressLine1:
          address.addressLine1,

        addressLine2:
          address.addressLine2,

        city:
          address.city,

        state:
          address.state,

        country:
          address.country || "India",

        pincode:
          address.pincode,

        phone:
          address.phone,

        items: {
          create: items.map(
            (item) => ({
              productId:
                item.productId,

              quantity:
                item.quantity,

              price:
                item.price,
            })
          ),
        },
      },

      include: {
        items: true,
      },
    });

  await redis.del(
    USER_ORDERS_CACHE(userId)
  );

  await publishOrderCreated({
    orderId: order.id,

    userId:
      order.userId,

    totalAmount:
      order.totalAmount,

    items:
      order.items.map(
        (item) => ({
          productId:
            item.productId,

          quantity:
            item.quantity,

          price:
            item.price,
        })
      ),
  });

  return order;
}

/* =======================================================
   GET MY ORDERS
======================================================= */

export async function getOrders(
  userId: string
) {
  const cacheKey =
    USER_ORDERS_CACHE(userId);

  const cached =
    await redis.get(cacheKey);

  if (cached) {
    console.log(
      "⚡ Orders fetched from Redis"
    );

    return JSON.parse(cached);
  }

  const orders =
    await prisma.order.findMany({
      where: {
        userId,
      },

      orderBy: {
        createdAt: "desc",
      },

      include: {
        items: true,
      },
    });

  await redis.set(
    cacheKey,
    JSON.stringify(orders),
    "EX",
    60
  );

  return orders;
}

/* =======================================================
   GET VENDOR ORDERS
======================================================= */

export async function getVendorOrdersService(
  userId: string,
  authorization: string
) {
  console.log(
    "🔎 Finding vendor products for userId:",
    userId
  );

  const productServiceUrl =
    `${PRODUCT_SERVICE_URL}/products/vendor`;

  console.log(
    "➡️ Calling Product Service:",
    productServiceUrl
  );

  /* =====================================================
     CALL PRODUCT SERVICE
  ===================================================== */

  let response: Response;

  try {
    response = await fetch(
      productServiceUrl,
      {
        method: "GET",

        headers: {
          Authorization:
            authorization,

          Accept:
            "application/json",
        },
      }
    );
  } catch (error) {
    console.error(
      "❌ Could not connect to Product Service:",
      error
    );

    const serviceError: any =
      new Error(
        "Product Service unavailable"
      );

    serviceError.statusCode = 502;

    throw serviceError;
  }

  /* =====================================================
     HANDLE PRODUCT SERVICE ERROR
  ===================================================== */

  if (!response.ok) {
    const text =
      await response.text();

    console.error(
      "❌ Product Service returned:",
      response.status,
      text
    );

    const serviceError: any =
      new Error(
        `Product Service returned ${response.status}`
      );

    serviceError.statusCode =
      response.status;

    throw serviceError;
  }

  /* =====================================================
     READ PRODUCT RESPONSE
  ===================================================== */

  const productResponse =
    await response.json();

  const vendorProducts =
    Array.isArray(productResponse)
      ? productResponse
      : productResponse?.data || [];

  console.log(
    "📦 Vendor products found:",
    vendorProducts.length
  );

  /* =====================================================
     BUILD VENDOR PRODUCT ID SET
  ===================================================== */

  const vendorProductIds =
    new Set<string>(
      vendorProducts
        .map(
          (product: any) =>
            product.id
        )
        .filter(Boolean)
    );

  console.log(
    "🛍️ Vendor product IDs:",
    Array.from(
      vendorProductIds
    )
  );

  /* =====================================================
     NO PRODUCTS
  ===================================================== */

  if (
    vendorProductIds.size === 0
  ) {
    console.log(
      "ℹ️ Vendor has no products"
    );

    return [];
  }

  /* =====================================================
     FIND ORDERS CONTAINING VENDOR PRODUCTS
  ===================================================== */

  const orders =
    await prisma.order.findMany({
      where: {
        items: {
          some: {
            productId: {
              in: Array.from(
                vendorProductIds
              ),
            },
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },

      include: {
        items: true,
      },
    });

  console.log(
    "📋 Orders containing vendor products:",
    orders.length
  );

  /* =====================================================
     RETURN ONLY VENDOR ITEMS
  ===================================================== */

  const vendorOrders =
    orders
      .map((order) => ({
        ...order,

        items:
          order.items.filter(
            (item) =>
              vendorProductIds.has(
                item.productId
              )
          ),
      }))
      .filter(
        (order) =>
          order.items.length > 0
      );

  console.log(
    "✅ Vendor orders returned:",
    vendorOrders.length
  );

  return vendorOrders;
}

/* =======================================================
   GET ORDER BY ID
======================================================= */

export async function getOrderById(
  orderId: string
) {
  return prisma.order.findUnique({
    where: {
      id: orderId,
    },

    include: {
      items: true,
    },
  });
}

/* =======================================================
   UPDATE ORDER STATUS
======================================================= */

export async function updateOrderStatus(
  orderId: string,
  status: string
) {
  const order =
    await prisma.order.update({
      where: {
        id: orderId,
      },

      data: {
        status,
      },

      include: {
        items: true,
      },
    });

  await redis.del(
    USER_ORDERS_CACHE(
      order.userId
    )
  );

  if (
    status === "CANCELLED"
  ) {
    await publishOrderCancelled({
      orderId: order.id,

      userId:
        order.userId,
    });
  }

  return order;
}

/* =======================================================
   CONFIRM ORDER
======================================================= */

export async function confirmOrderService(
  orderId: string
) {
  const order =
    await prisma.order.update({
      where: {
        id: orderId,
      },

      data: {
        status: "CONFIRMED",
      },
    });

  await redis.del(
    USER_ORDERS_CACHE(
      order.userId
    )
  );

  return order;
}

/* =======================================================
   CANCEL ORDER
======================================================= */

export async function cancelOrderService(
  orderId: string
) {
  const order =
    await prisma.order.update({
      where: {
        id: orderId,
      },

      data: {
        status: "CANCELLED",
      },
    });

  await redis.del(
    USER_ORDERS_CACHE(
      order.userId
    )
  );

  await publishOrderCancelled({
    orderId: order.id,

    userId:
      order.userId,
  });

  return order;
}
