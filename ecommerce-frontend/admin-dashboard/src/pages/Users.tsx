import { useEffect, useState } from "react";
import { getUsers, blockUser } from "../api/users";

interface User {
  id: string;
  name?: string;
  email?: string;
  role?: string;
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =====================================================
     LOAD USERS
  ===================================================== */

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getUsers();

      setUsers(data);
    } catch (err: any) {
      console.error("❌ Failed to load users:", err);

      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Failed to load users"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  /* =====================================================
     BLOCK USER
  ===================================================== */

  const handleBlock = async (id: string) => {
    try {
      await blockUser(id);

      setUsers((currentUsers) =>
        currentUsers.filter((user) => user.id !== id)
      );
    } catch (err: any) {
      console.error("❌ Failed to block user:", err);

      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Failed to block user"
      );
    }
  };

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">
          Users
        </h1>

        <p>Loading users...</p>
      </div>
    );
  }

  /* =====================================================
     PAGE
  ===================================================== */

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">
          Users
        </h1>

        <button
          onClick={loadUsers}
          className="border px-3 py-1 rounded"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {users.length === 0 ? (
        <div className="p-6 bg-white shadow rounded">
          <p>No users found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {users.map((user) => (
            <div
              key={user.id}
              className="p-4 bg-white shadow rounded flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">
                  {user.name || "Unnamed User"}
                </p>

                <p className="text-sm text-gray-500">
                  {user.email || "No email"}
                </p>

                {user.role && (
                  <p className="text-xs text-gray-400 mt-1">
                    Role: {user.role}
                  </p>
                )}
              </div>

              <button
                onClick={() => handleBlock(user.id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Block
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
