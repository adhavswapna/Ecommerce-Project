export interface CartItemAddedEvent {
  userId: string;
  productId: string;
  quantity: number;
  price: number;
}

export interface CartItemRemovedEvent {
  userId: string;
  productId: string;
}

export interface CartClearedEvent {
  userId: string;
}
