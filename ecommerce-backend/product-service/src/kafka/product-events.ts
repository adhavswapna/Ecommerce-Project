// src/kafka/product-events.ts

export interface ProductCreatedEvent {
  productId: string;
  name: string;
  description?: string;
  price: number;
  vendorId: string;
  categoryId: string;
  createdAt: string;
}

export interface ProductUpdatedEvent {
  productId: string;
  name?: string;
  description?: string;
  price?: number;
  categoryId?: string;
  updatedAt: string;
}

export interface ProductDeletedEvent {
  productId: string;
  deletedAt: string;
}

export interface ProductStockUpdatedEvent {
  productId: string;
  stock: number;
}
