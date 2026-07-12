import { useEffect, useState } from "react";
import { getVendors, approveVendor, rejectVendor } from "../api/vendors";

export default function Vendors() {
  const [vendors, setVendors] = useState<any[]>([]);

  useEffect(() => {
    getVendors().then(setVendors);
  }, []);

  const approve = async (id: string) => {
    await approveVendor(id);
    setVendors(vendors.filter((v) => v.id !== id));
  };

  const reject = async (id: string) => {
    await rejectVendor(id);
    setVendors(vendors.filter((v) => v.id !== id));
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Vendor Approvals</h1>

      <div className="space-y-3">
        {vendors.map((v) => (
          <div key={v.id} className="p-4 bg-white shadow rounded flex justify-between">
            <div>
              <p>{v.name}</p>
              <p className="text-sm text-gray-500">{v.email}</p>
              <p className="text-xs text-yellow-600">{v.status}</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => approve(v.id)}
                className="bg-green-500 text-white px-3 py-1 rounded"
              >
                Approve
              </button>

              <button
                onClick={() => reject(v.id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
