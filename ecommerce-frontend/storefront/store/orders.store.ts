// store/orders.store.ts

import { create } from "zustand";
import { Order } from "@/types/order";
import { getMyOrders, getOrderById } from "@/lib/api/order.api";

interface OrdersState {
  orders: Order[];
  selectedOrder: Order | null;
  loading: boolean;
  fetchOrders: () => Promise<void>;
  fetchOrder: (id: string) => Promise<void>;
}

export const useOrdersStore = create<OrdersState>((set) => ({
  orders: [],
  selectedOrder: null,
  loading: false,

  fetchOrders: async () => {
    set({ loading: true });
    try {
      const data = await getMyOrders();
      set({ orders: data });
    } catch (error) {
      console.error("Failed to fetch orders", error);
    } finally {
      set({ loading: false });
    }
  },

  fetchOrder: async (id: string) => {
    set({ loading: true });
    try {
      const data = await getOrderById(id);
      set({ selectedOrder: data });
    } catch (error) {
      console.error("Failed to fetch order", error);
    } finally {
      set({ loading: false });
    }
  },
}));
