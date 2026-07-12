import { Link } from "react-router-dom";

export default function Layout({ children }: any) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-black text-white p-5">
        <h1 className="text-xl font-bold mb-6">Admin Panel</h1>

        <nav className="flex flex-col gap-3">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/users">Users</Link>
          <Link to="/vendors">Vendors</Link>
          <Link to="/refunds">Refunds</Link>
          <Link to="/analytics">Analytics</Link>
        </nav>
      </aside>

      <main className="flex-1 p-6 bg-gray-100">{children}</main>
    </div>
  );
}
