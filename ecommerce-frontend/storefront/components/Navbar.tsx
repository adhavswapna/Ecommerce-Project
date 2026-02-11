import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-6 py-4 border-b">
      <Link href="/" className="font-bold text-xl">
        MyStore
      </Link>

      <div className="flex gap-4">
        <Link href="/login">Login</Link>
        <Link href="/register">Register</Link>
      </div>
    </nav>
  );
}

