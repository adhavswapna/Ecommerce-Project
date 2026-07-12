import { useEffect, useState } from "react";
import { getVendorOrders } from "../api/orders";

export default function Orders() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    getVendorOrders().then(setOrders);
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Orders</h1>

      <div className="space-y-3">
        {orders.map((o) => (
          <div key={o.id} className="p-4 bg-white shadow rounded">
            <p>
              <b>Order ID:</b> {o.id}
            </p>
            <p>
              <b>Status:</b> {o.status}
            </p>
            <p>
              <b>Total:</b> ₹{o.total}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
