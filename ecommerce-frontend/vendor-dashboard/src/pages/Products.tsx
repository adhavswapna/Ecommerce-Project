import { useEffect, useState } from "react";
import {
  getVendorProducts,
  createProduct,
} from "../api/products";

export default function Products() {
  const [products, setProducts] =
    useState<any[]>([]);

  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    description: "",
  });

  const [loading, setLoading] =
    useState(false);

  const [loadingProducts, setLoadingProducts] =
    useState(true);

  const [error, setError] =
    useState("");

  const load = async () => {
    try {
      setLoadingProducts(true);
      setError("");

      const data =
        await getVendorProducts();

      setProducts(data);
    } catch (err) {
      console.error(
        "Failed to load products:",
        err
      );

      setError(
        "Unable to load products."
      );
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async () => {
    if (!form.name.trim()) {
      alert("Product name is required.");
      return;
    }

    if (!form.price) {
      alert("Product price is required.");
      return;
    }

    if (!form.stock) {
      alert("Product stock is required.");
      return;
    }

    try {
      setLoading(true);

      await createProduct({
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
      });

      alert(
        "Product created successfully ✅"
      );

      setForm({
        name: "",
        price: "",
        stock: "",
        description: "",
      });

      await load();
    } catch (err: any) {
      console.error(
        "Failed to create product:",
        err
      );

      alert(
        err?.response?.data?.message ||
          "Failed to create product."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1
        style={{
          fontSize: "28px",
          fontWeight: "bold",
          marginBottom: "20px",
        }}
      >
        My Products
      </h1>

      {/* CREATE PRODUCT */}

      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "8px",
          marginBottom: "25px",
          boxShadow:
            "0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        <h2
          style={{
            fontSize: "20px",
            fontWeight: "bold",
            marginBottom: "15px",
          }}
        >
          Add Product
        </h2>

        <div
          style={{
            display: "grid",
            gap: "12px",
            maxWidth: "600px",
          }}
        >
          <input
            placeholder="Product Name"
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
            disabled={loading}
            style={{
              padding: "10px",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
            }}
          />

          <input
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={(e) =>
              setForm({
                ...form,
                price: e.target.value,
              })
            }
            disabled={loading}
            style={{
              padding: "10px",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
            }}
          />

          <input
            type="number"
            placeholder="Stock"
            value={form.stock}
            onChange={(e) =>
              setForm({
                ...form,
                stock: e.target.value,
              })
            }
            disabled={loading}
            style={{
              padding: "10px",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
            }}
          />

          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) =>
              setForm({
                ...form,
                description: e.target.value,
              })
            }
            disabled={loading}
            style={{
              padding: "10px",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
              minHeight: "80px",
            }}
          />

          <button
            onClick={handleCreate}
            disabled={loading}
            style={{
              padding: "12px",
              background: "#111827",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: loading
                ? "not-allowed"
                : "pointer",
            }}
          >
            {loading
              ? "Creating..."
              : "Create Product"}
          </button>
        </div>
      </div>

      {/* PRODUCT LIST */}

      <h2
        style={{
          fontSize: "20px",
          fontWeight: "bold",
          marginBottom: "15px",
        }}
      >
        My Product List
      </h2>

      {loadingProducts && (
        <p>Loading products...</p>
      )}

      {error && (
        <p style={{ color: "#dc2626" }}>
          {error}
        </p>
      )}

      {!loadingProducts &&
        !error &&
        products.length === 0 && (
          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "8px",
            }}
          >
            No products found.
          </div>
        )}

      <div
        style={{
          display: "grid",
          gap: "12px",
        }}
      >
        {products.map((p) => (
          <div
            key={p.id}
            style={{
              background: "white",
              padding: "18px",
              borderRadius: "8px",
              boxShadow:
                "0 1px 3px rgba(0,0,0,0.1)",
            }}
          >
            <h3
              style={{
                fontWeight: "bold",
                fontSize: "18px",
              }}
            >
              {p.name}
            </h3>

            <p>
              Price: ₹{p.price}
            </p>

            <p>
              Stock: {p.stock}
            </p>

            {p.description && (
              <p
                style={{
                  color: "#6b7280",
                  marginTop: "5px",
                }}
              >
                {p.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
