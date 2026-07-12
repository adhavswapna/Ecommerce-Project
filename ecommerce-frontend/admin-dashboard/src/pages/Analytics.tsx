import { useEffect, useState } from "react";
import { getPlatformAnalytics } from "../api/analytics";

export default function Analytics() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    getPlatformAnalytics().then(setData);
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Platform Analytics</h1>

      {!data ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-white shadow rounded">
            Revenue: ₹{data.totalRevenue}
          </div>

          <div className="p-4 bg-white shadow rounded">
            Orders: {data.totalOrders}
          </div>

          <div className="p-4 bg-white shadow rounded">
            Active Users: {data.activeUsers}
          </div>

          <div className="p-4 bg-white shadow rounded">
            Pending Vendors: {data.pendingVendors}
          </div>
        </div>
      )}
    </div>
  );
}
