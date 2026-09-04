import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  Link,
  useNavigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CreateAdmin from "./pages/CreateAdmin";
import BanUser from "./pages/BanUser";
import Vendors from "./pages/Vendors";
import Users from "./pages/Users";
import Refunds from "./pages/Refunds";
import Analytics from "./pages/Analytics";

/* =====================================================
   PROTECTED ROUTE
===================================================== */

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

/* =====================================================
   ADMIN LAYOUT
===================================================== */

function DashboardLayout() {
  const navigate = useNavigate();

  const adminUser = localStorage.getItem("adminUser");

  let user: {
    name?: string;
    email?: string;
  } | null = null;

  try {
    user = adminUser ? JSON.parse(adminUser) : null;
  } catch {
    user = null;
  }

  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");

    navigate("/login", {
      replace: true,
    });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f6f8",
      }}
    >
      {/* =================================================
          HEADER
      ================================================= */}

      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "18px 30px",
          background: "#ffffff",
          borderBottom: "1px solid #ddd",
        }}
      >
        <div>
          <h2
            style={{
              margin: 0,
            }}
          >
            ShopSphere Admin
          </h2>

          {user && (
            <small
              style={{
                color: "#666",
              }}
            >
              {user.name || "Admin"}
              {user.email ? ` — ${user.email}` : ""}
            </small>
          )}
        </div>

        <button
          onClick={logout}
          style={{
            padding: "8px 16px",
            border: "none",
            borderRadius: "6px",
            background: "#dc2626",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </header>

      {/* =================================================
          NAVIGATION
      ================================================= */}

      <nav
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          padding: "15px 30px",
          background: "#ffffff",
          borderBottom: "1px solid #ddd",
        }}
      >
        <Link to="/dashboard" style={linkStyle}>
          Dashboard
        </Link>

        <Link to="/vendors" style={linkStyle}>
          Vendors
        </Link>

        <Link to="/users" style={linkStyle}>
          Users
        </Link>

        <Link to="/refunds" style={linkStyle}>
          Refunds
        </Link>

        <Link to="/analytics" style={linkStyle}>
          Analytics
        </Link>

        <Link to="/create-admin" style={linkStyle}>
          Create Admin
        </Link>

        <Link to="/ban-user" style={linkStyle}>
          Ban User
        </Link>
      </nav>

      {/* =================================================
          PAGE CONTENT
      ================================================= */}

      <main
        style={{
          padding: "30px",
        }}
      >
        <Routes>
          {/* Dashboard */}

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          {/* Vendors */}

          <Route
            path="/vendors"
            element={<Vendors />}
          />

          {/* Users */}

          <Route
            path="/users"
            element={<Users />}
          />

          {/* Refunds */}

          <Route
            path="/refunds"
            element={<Refunds />}
          />

          {/* Analytics */}

          <Route
            path="/analytics"
            element={<Analytics />}
          />

          {/* Create Admin */}

          <Route
            path="/create-admin"
            element={<CreateAdmin />}
          />

          {/* Ban User */}

          <Route
            path="/ban-user"
            element={<BanUser />}
          />

          {/* Unknown admin route */}

          <Route
            path="*"
            element={
              <Navigate
                to="/dashboard"
                replace
              />
            }
          />
        </Routes>
      </main>
    </div>
  );
}

/* =====================================================
   NAV LINK STYLE
===================================================== */

const linkStyle: React.CSSProperties = {
  padding: "9px 14px",
  borderRadius: "6px",
  background: "#f1f5f9",
  color: "#111827",
  textDecoration: "none",
  fontWeight: 500,
};

/* =====================================================
   APP
===================================================== */

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* =================================================
            LOGIN
        ================================================= */}

        <Route
          path="/login"
          element={<Login />}
        />

        {/* =================================================
            PROTECTED ADMIN AREA
        ================================================= */}

        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
