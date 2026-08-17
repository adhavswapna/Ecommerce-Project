import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const location = useLocation();
  const navigate = useNavigate();

  const userText =
    localStorage.getItem("vendorUser");

  let user: any = null;

  try {
    user = userText
      ? JSON.parse(userText)
      : null;
  } catch {
    user = null;
  }

  const logout = () => {
    localStorage.removeItem("vendorToken");
    localStorage.removeItem("vendorUser");

    navigate("/login");
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        background: "#f5f5f5",
      }}
    >
      {/* SIDEBAR */}

      <aside
        style={{
          width: "240px",
          background: "#111827",
          color: "white",
          padding: "24px",
          minHeight: "100vh",
          boxSizing: "border-box",
        }}
      >
        <h1
          style={{
            fontSize: "22px",
            fontWeight: "bold",
            marginBottom: "30px",
          }}
        >
          Vendor Panel
        </h1>

        <nav
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <Link
            to="/dashboard"
            style={{
              color: "white",
              textDecoration: "none",
              padding: "12px",
              borderRadius: "6px",
              background: isActive("/dashboard")
                ? "#374151"
                : "transparent",
            }}
          >
            Dashboard
          </Link>

          <Link
            to="/products"
            style={{
              color: "white",
              textDecoration: "none",
              padding: "12px",
              borderRadius: "6px",
              background: isActive("/products")
                ? "#374151"
                : "transparent",
            }}
          >
            Products
          </Link>

          <Link
            to="/orders"
            style={{
              color: "white",
              textDecoration: "none",
              padding: "12px",
              borderRadius: "6px",
              background: isActive("/orders")
                ? "#374151"
                : "transparent",
            }}
          >
            Orders
          </Link>

          <Link
            to="/analytics"
            style={{
              color: "white",
              textDecoration: "none",
              padding: "12px",
              borderRadius: "6px",
              background: isActive("/analytics")
                ? "#374151"
                : "transparent",
            }}
          >
            Analytics
          </Link>
        </nav>

        {/* USER */}

        <div
          style={{
            marginTop: "40px",
            paddingTop: "20px",
            borderTop: "1px solid #374151",
          }}
        >
          <p
            style={{
              fontWeight: "bold",
              marginBottom: "5px",
            }}
          >
            {user?.name || "Vendor"}
          </p>

          <p
            style={{
              fontSize: "13px",
              color: "#d1d5db",
              wordBreak: "break-word",
            }}
          >
            {user?.email || ""}
          </p>

          <p
            style={{
              fontSize: "12px",
              color: "#9ca3af",
            }}
          >
            {user?.role || "VENDOR"}
          </p>

          <button
            onClick={logout}
            style={{
              marginTop: "15px",
              width: "100%",
              padding: "10px",
              background: "#dc2626",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}

      <main
        style={{
          flex: 1,
          padding: "30px",
          boxSizing: "border-box",
        }}
      >
        {children}
      </main>
    </div>
  );
}
