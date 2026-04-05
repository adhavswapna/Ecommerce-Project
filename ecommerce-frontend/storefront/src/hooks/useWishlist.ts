import { useEffect, useState } from "react";
import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  moveToCart,
} from "@/api/wishlist";

export const useWishlist = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // ❤️ FETCH
  const fetchWishlist = async () => {
    try {
      const res = await getWishlist();
      setItems(res.data);
    } catch (err) {
      console.error("Wishlist fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ➕ ADD
  const addItem = async (productId: string) => {
    try {
      await addToWishlist(productId);
      await fetchWishlist();
    } catch (err) {
      console.error("Wishlist add error:", err);
      throw err;
    }
  };

  // ❌ REMOVE
  const removeItem = async (id: string) => {
    try {
      await removeFromWishlist(id);
      fetchWishlist();
    } catch (err) {
      console.error(err);
    }
  };

  // 🔁 MOVE TO CART
  const moveItemToCart = async (id: string) => {
    try {
      await moveToCart(id);
      fetchWishlist();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  return {
    items,
    loading,
    fetchWishlist,
    addItem,
    removeItem,
    moveItemToCart,
  };
};
