export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  price: number;
  type: "CART" | "WISHLIST";
}

export interface AddToCartPayload {
  productId: string;
  quantity: number;
}
