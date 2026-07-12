import { useEffect, useState } from "react";
import { getPlatformAnalytics } from "../api/analytics";

export default function Dashboard() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    getPlatformAnalytics().then(setData);
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">System Overview</h1>

      {!data ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-white shadow rounded">
            <h3>Total Users</h3>
            <p className="text-xl font-bold">{data.totalUsers}</p>
          </div>

          <div className="p-4 bg-white shadow rounded">
            <h3>Total Vendors</h3>
            <p className="text-xl font-bold">{data.totalVendors}</p>
          </div>

          <div className="p-4 bg-white shadow rounded">
            <h3>Total Revenue</h3>
            <p className="text-xl font-bold">₹{data.totalRevenue}</p>
          </div>
        </div>
      )}
    </div>
  );
}
