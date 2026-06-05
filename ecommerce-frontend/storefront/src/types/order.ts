// src/types/order.ts

/**
 * =========================================
 * ORDER STATUS TYPES
 * =========================================
 */

export type PaymentStatus =
  | "PENDING"
  | "SUCCESS"
  | "FAILED"
  | "REFUNDED";

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED";

/**
 * =========================================
 * PRODUCT SUMMARY
 * =========================================
 */

export interface ProductSummary {
  id: string;

  name: string;

  slug?: string;

  image?: string;

  price?: number;
}

/**
 * =========================================
 * ORDER ITEM
 * =========================================
 */

export interface OrderItem {
  id: string;

  orderId: string;

  productId: string;

  quantity: number;

  price: number;

  product?: ProductSummary;
}

/**
 * =========================================
 * ADDRESS
 * =========================================
 */

export interface Address {
  addressLine1: string;

  addressLine2?: string;

  city: string;

  state: string;

  country: string;

  pincode: string;

  phone: string;
}

/**
 * =========================================
 * ORDER
 * =========================================
 */

export interface Order {
  id: string;

  userId: string;

  totalAmount: number;

  currency: string;

  paymentMethod: string;

  paymentStatus: PaymentStatus;

  status: OrderStatus;

  addressLine1: string;

  addressLine2?: string;

  city: string;

  state: string;

  country: string;

  pincode: string;

  phone: string;

  createdAt: string;

  updatedAt: string;

  items: OrderItem[];
}

/**
 * =========================================
 * CREATE ORDER
 * =========================================
 */

export interface CreateOrderItemPayload {
  productId: string;

  quantity: number;

  price: number;
}

export interface CreateOrderPayload {
  userId?: string;

  totalAmount: number;

  currency: string;

  paymentMethod: string;

  address: Address;

  items: CreateOrderItemPayload[];
}

/**
 * =========================================
 * UPDATE ORDER
 * =========================================
 */

export interface UpdateOrderStatusPayload {
  status: OrderStatus;
}

export interface UpdatePaymentStatusPayload {
  paymentStatus: PaymentStatus;
}

/**
 * =========================================
 * API RESPONSES
 * =========================================
 */

export interface OrderResponse {
  success: boolean;

  message?: string;

  data: Order;
}

export interface OrdersResponse {
  success: boolean;

  data: Order[];
}
