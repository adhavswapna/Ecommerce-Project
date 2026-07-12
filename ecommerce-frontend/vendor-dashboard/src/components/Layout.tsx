import { Link } from "react-router-dom";

export default function Layout({ children }: any) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-black text-white p-4">
        <h2 className="text-xl font-bold mb-6">Vendor Panel</h2>

        <nav className="flex flex-col gap-3">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/products">Products</Link>
          <Link to="/orders">Orders</Link>
          <Link to="/analytics">Analytics</Link>
        </nav>
      </aside>

      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
