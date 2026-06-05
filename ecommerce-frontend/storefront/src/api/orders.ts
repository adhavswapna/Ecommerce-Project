import { orderApi } from "./apiClient";

import {
  CreateOrderPayload,
  Order,
  OrderResponse,
  OrdersResponse,
} from "@/types/order";



/**
 * CREATE ORDER
 */
export const createOrder =
async (
  payload: CreateOrderPayload
): Promise<Order> => {

  const response =
    await orderApi.post<OrderResponse>(
      "/orders",
      payload
    );


  return (
    response.data.data ??
    response.data
  );

};





/**
 * GET MY ORDERS
 */
export const getMyOrders =
async (): Promise<Order[]> => {


  const response =
    await orderApi.get(
      "/orders/my"
    );


  console.log(
    "MY ORDERS RESPONSE",
    response.data
  );


  return (
    response.data.data ??
    response.data ??
    []
  );

};






/**
 * GET ORDER BY ID
 */
export const getOrderById =
async (
  id:string
):Promise<Order> => {


  const response =
    await orderApi.get<OrderResponse>(
      `/orders/${id}`
    );


  console.log(
    "ORDER BY ID",
    response.data
  );


  return (
    response.data.data ??
    response.data
  );

};







/**
 * CONFIRM ORDER
 *
 * backend:
 * POST /orders/confirm/:orderId
 */
export const confirmOrder =
async (
  orderId:string
):Promise<Order> => {


  const response =
    await orderApi.post<OrderResponse>(
      `/orders/confirm/${orderId}`
    );


  return (
    response.data.data ??
    response.data
  );

};








/**
 * CANCEL ORDER
 *
 * backend:
 * DELETE /orders/cancel/:orderId
 */
export const cancelOrder =
async (
  orderId:string
):Promise<Order> => {


  const response =
    await orderApi.delete<OrderResponse>(
      `/orders/cancel/${orderId}`
    );


  return (
    response.data.data ??
    response.data
  );

};








/**
 * ADMIN ORDERS
 *
 * keep only if backend has admin route
 */
export const getOrders =
async ():Promise<Order[]> => {


  const response =
    await orderApi.get<OrdersResponse>(
      "/orders"
    );


  return (
    response.data.data ??
    []
  );

};
