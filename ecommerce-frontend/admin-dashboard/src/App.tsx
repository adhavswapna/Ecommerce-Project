import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CreateAdmin from "./pages/CreateAdmin";
import CreateVendor from "./pages/CreateVendor";
import BanUser from "./pages/BanUser";
import Vendors from "./pages/Vendors";

function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = localStorage.getItem("adminToken");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function DashboardLayout() {
  const adminUser = localStorage.getItem("adminUser");

  const user = adminUser
    ? JSON.parse(adminUser)
    : null;

  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");

    window.location.href = "/login";
  };

  return (
    <div style={{ padding: "20px" }}>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          paddingBottom: "15px",
          borderBottom: "1px solid #ddd",
        }}
      >
        <div>
          <h2 style={{ margin: 0 }}>ShopSphere Admin</h2>

          {user && (
            <small>
              {user.name} — {user.email}
            </small>
          )}
        </div>

        <button onClick={logout}>
          Logout
        </button>
      </header>

      <Dashboard />

      <hr />

      <CreateAdmin />

      <hr />

      <CreateVendor />

      <hr />

      <Vendors />

      <hr />

      <BanUser />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        />

        <Route
          path="/"
          element={<Navigate to="/dashboard" replace />}
        />

        <Route
          path="*"
          element={<Navigate to="/dashboard" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
