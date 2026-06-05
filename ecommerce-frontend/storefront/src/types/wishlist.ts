export interface WishlistItem {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  price: number;
  type: "WISHLIST";
}
