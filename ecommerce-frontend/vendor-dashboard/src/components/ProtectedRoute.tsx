import { Navigate } from "react-router-dom";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const token =
    localStorage.getItem("vendorToken");

  const userText =
    localStorage.getItem("vendorUser");

  if (!token || !userText) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  try {
    const user = JSON.parse(userText);

    if (user.role !== "VENDOR") {
      localStorage.removeItem("vendorToken");
      localStorage.removeItem("vendorUser");

      return (
        <Navigate
          to="/login"
          replace
        />
      );
    }
  } catch {
    localStorage.removeItem("vendorToken");
    localStorage.removeItem("vendorUser");

    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return <>{children}</>;
}
