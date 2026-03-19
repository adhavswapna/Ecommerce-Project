"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

const ORDER_API = process.env.NEXT_PUBLIC_ORDER_API_URL;

/* ================= TYPES ================= */
interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  status: string;
  totalAmount: number;
  items: OrderItem[];
}

/* ================= SAFE USER ================= */
function getUserId() {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;

    const payload = JSON.parse(atob(token.split(".")[1]));

    if (payload.exp && payload.exp * 1000 < Date.now()) {
      localStorage.removeItem("token");
      return null;
    }

    return payload.userId;
  } catch {
    return null;
  }
}

/* ================= STATUS COLOR ================= */
const getStatusColor = (status: string) => {
  switch (status) {
    case "DELIVERED":
      return "text-green-600";
    case "CANCELLED":
      return "text-red-500";
    case "SHIPPED":
      return "text-blue-500";
    default:
      return "text-gray-500";
  }
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const router = useRouter();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const userId = getUserId();

      if (!userId) {
        router.push("/login");
        return;
      }

      const res = await api.get(`${ORDER_API}/orders/user/${userId}`);

      // ✅ Handle multiple backend formats safely
      const data = res.data?.orders || res.data || [];

      setOrders(data);
    } catch (err: any) {
      console.error("Orders fetch error:", err?.response?.data || err.message);
      setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  /* ================= UI STATES ================= */

  if (loading) return <p className="p-6">Loading orders...</p>;

  if (error)
    return (
      <div className="p-6">
        <p className="text-red-500">{error}</p>
        <button
          onClick={fetchOrders}
          className="mt-4 px-4 py-2 bg-black text-white rounded"
        >
          Retry
        </button>
      </div>
    );

  if (orders.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">No orders yet</p>
        <button
          onClick={() => router.push("/products")}
          className="mt-4 px-4 py-2 bg-black text-white rounded"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  /* ================= UI ================= */

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order.id}
            className="border p-4 rounded cursor-pointer hover:bg-gray-50 transition"
            onClick={() => router.push(`/orders/${order.id}`)}
          >
            <div className="flex justify-between">
              <p className="font-semibold">Order ID: {order.id}</p>
              <p className={`text-sm ${getStatusColor(order.status)}`}>
                {order.status}
              </p>
            </div>

            <p className="mt-2 font-medium">
              Total: ₹{order.totalAmount}
            </p>

            <div className="mt-3 space-y-1 text-sm text-gray-600">
              {order.items?.map((item) => (
                <div key={item.id}>
                  Product: {item.productId} | Qty: {item.quantity}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
