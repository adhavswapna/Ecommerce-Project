// hooks/useOrder.ts

import { useEffect } from "react";
import { useOrdersStore } from "@/store/orders.store";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  confirmOrder,
  cancelOrder,
} from "@/lib/api/order.api";

export const useOrders = (userId: string) => {
  const { orders, loading, setOrders, setLoading } = useOrdersStore();

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const data = await getMyOrders(userId);
        setOrders(data);
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetchOrders();
  }, [userId]);

  return { orders, loading };
};

export const useOrderDetails = (id: string) => {
  const { selectedOrder, loading, setSelectedOrder, setLoading } = useOrdersStore();

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const data = await getOrderById(id);
        setSelectedOrder(data);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchOrder();
  }, [id]);

  return { order: selectedOrder, loading };
};

// Create new order
export const useCreateOrder = () => {
  const { addOrder } = useOrdersStore();

  const handleCreateOrder = async (orderData: {
    userId: string;
    totalAmount: number;
    currency: "INR" | "USD";
    paymentMethod: "cod" | "card" | "upi" | "netbanking";
    items: { productId: string; quantity: number; price: number }[];
  }) => {
    const order = await createOrder(orderData);
    addOrder(order);
    return order;
  };

  return { handleCreateOrder };
};

// Confirm order
export const useConfirmOrder = () => {
  const { updateOrder } = useOrdersStore();

  const handleConfirmOrder = async (orderId: string) => {
    const order = await confirmOrder(orderId);
    updateOrder(order);
    return order;
  };

  return { handleConfirmOrder };
};

// Cancel order
export const useCancelOrder = () => {
  const { updateOrder } = useOrdersStore();

  const handleCancelOrder = async (orderId: string) => {
    const order = await cancelOrder(orderId);
    updateOrder(order);
    return order;
  };

  return { handleCancelOrder };
};

