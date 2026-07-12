import { useEffect, useState } from "react";
import { getVendorAnalytics } from "../api/analytics";

export default function Analytics() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    getVendorAnalytics().then(setData);
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Analytics</h1>

      {!data ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-3">
          <div className="p-4 bg-white shadow rounded">
            <p>Total Revenue: ₹{data.totalSales}</p>
          </div>

          <div className="p-4 bg-white shadow rounded">
            <p>Orders: {data.totalOrders}</p>
          </div>

          <div className="p-4 bg-white shadow rounded">
            <p>Conversion Rate: {data.conversionRate}%</p>
          </div>
        </div>
      )}
    </div>
  );
}
