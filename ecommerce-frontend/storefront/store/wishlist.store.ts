import { create } from "zustand";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}

interface WishlistState {
  items: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (id: string) => void;
}

export const useWishlistStore = create<WishlistState>((set) => ({
  items: [],
  addToWishlist: (product) =>
    set((state) => {
      if (!state.items.find((i) => i.id === product.id)) {
        return { items: [...state.items, product] };
      }
      return state;
    }),
  removeFromWishlist: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),
}));

