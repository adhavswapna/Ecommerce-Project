"use client";

import { create } from "zustand";

import toast from "react-hot-toast";

import {
  createOrder,
  getMyOrders,
  getOrderById,
} from "@/api/orders";

import {
  CreateOrderPayload,
  Order,
} from "@/types/order";

interface OrderState {
  orders: Order[];

  order: Order | null;

  loading: boolean;

  fetchOrders:
    () => Promise<void>;

  fetchOrder:
    (
      id: string
    ) => Promise<void>;

  create:
    (
      payload: CreateOrderPayload
    ) => Promise<Order | null>;
}

export const useOrderStore =
  create<OrderState>(
    (set) => ({
      orders: [],

      order: null,

      loading: false,

      fetchOrders:
        async () => {
          try {
            set({
              loading: true,
            });

            const data =
              await getMyOrders();

            set({
              orders: data,
            });
          } catch (
            error
          ) {
            console.error(
              error
            );

            toast.error(
              "Failed to fetch orders"
            );
          } finally {
            set({
              loading: false,
            });
          }
        },

      fetchOrder:
        async (id) => {
          try {
            set({
              loading: true,
            });

            const data =
              await getOrderById(
                id
              );

            set({
              order: data,
            });
          } catch (
            error
          ) {
            console.error(
              error
            );

            toast.error(
              "Failed to fetch order"
            );
          } finally {
            set({
              loading: false,
            });
          }
        },

      create:
        async (
          payload
        ) => {
          try {
            set({
              loading: true,
            });

            const order =
              await createOrder(
                payload
              );

            toast.success(
              "Order placed successfully"
            );

            return order;
          } catch (
            error
          ) {
            console.error(
              error
            );

            toast.error(
              "Failed to create order"
            );

            return null;
          } finally {
            set({
              loading: false,
            });
          }
        },
    })
  );
