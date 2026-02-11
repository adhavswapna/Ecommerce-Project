import "./globals.css";
import Header from "@/components/Header";

export const metadata = {
  title: "Storefront",
  description: "Ecommerce Storefront",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 min-h-screen flex flex-col">
        {/* Header / Navbar */}
        <Header />

        {/* Main content */}
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-gray-100 text-gray-700 py-6 mt-auto border-t">
          <div className="max-w-7xl mx-auto text-center text-sm">
            &copy; {new Date().getFullYear()} MyStorefront. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}

