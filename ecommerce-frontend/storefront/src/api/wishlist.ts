import { apiClient } from "./apiClient";


export interface WishlistItem {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  price: number;

  product?: {
    id: string;
    name: string;
    image?: string;
    price: number;
  };
}


/**
 * GET WISHLIST
 */
export const getWishlist = async (): Promise<WishlistItem[]> => {

  const response =
    await apiClient.get(
      "/cart/wishlist"
    );

  return (
    response.data?.items ||
    response.data?.wishlist ||
    response.data?.data?.items ||
    response.data ||
    []
  );
};



/**
 * ADD TO WISHLIST
 */
export const addToWishlist = async (
  data: {
    productId: string;
    quantity?: number;
    price?: number;
  }
): Promise<WishlistItem> => {

  const response =
    await apiClient.post(
      "/cart/wishlist/add",
      data
    );

  return response.data;

};



/**
 * REMOVE FROM WISHLIST
 */
export const removeFromWishlist = async (
  itemId: string
): Promise<void> => {

  await apiClient.delete(
    `/cart/wishlist/remove/${itemId}`
  );

};
