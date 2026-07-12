import { useEffect, useState } from "react";
import { getUsers, blockUser } from "../api/users";

export default function Users() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    getUsers().then(setUsers);
  }, []);

  const handleBlock = async (id: string) => {
    await blockUser(id);
    setUsers(users.filter((u) => u.id !== id));
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Users</h1>

      <div className="space-y-3">
        {users.map((u) => (
          <div key={u.id} className="p-4 bg-white shadow rounded flex justify-between">
            <div>
              <p>{u.name}</p>
              <p className="text-sm text-gray-500">{u.email}</p>
            </div>

            <button
              onClick={() => handleBlock(u.id)}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Block
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
