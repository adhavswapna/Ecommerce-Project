import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Analytics from "./pages/Analytics";

import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

function ProtectedLayout() {
  return (
    <ProtectedRoute>
      <Layout>
        <Routes>
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/products"
            element={<Products />}
          />

          <Route
            path="/orders"
            element={<Orders />}
          />

          <Route
            path="/analytics"
            element={<Analytics />}
          />

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
      </Layout>
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Vendor Login */}

        <Route
          path="/login"
          element={<Login />}
        />

        {/* Vendor Registration */}

        <Route
          path="/register"
          element={<Register />}
        />

        {/* Protected Vendor Dashboard */}

        <Route
          path="/*"
          element={<ProtectedLayout />}
        />
      </Routes>
    </BrowserRouter>
  );
}
