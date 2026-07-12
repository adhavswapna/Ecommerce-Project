import { useEffect, useState } from "react";
import { getVendorAnalytics } from "../api/analytics";

export default function Dashboard() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    getVendorAnalytics().then(setData);
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Vendor Dashboard</h1>

      {!data ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-white shadow rounded">
            <h3>Total Sales</h3>
            <p className="text-xl font-bold">₹{data.totalSales}</p>
          </div>

          <div className="p-4 bg-white shadow rounded">
            <h3>Total Orders</h3>
            <p className="text-xl font-bold">{data.totalOrders}</p>
          </div>

          <div className="p-4 bg-white shadow rounded">
            <h3>Total Products</h3>
            <p className="text-xl font-bold">{data.totalProducts}</p>
          </div>
        </div>
      )}
    </div>
  );
}
