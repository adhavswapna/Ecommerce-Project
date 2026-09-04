import { useEffect, useMemo, useState } from "react";

import {
  getVendorProducts,
  createProduct,
  uploadProductImage,
  deleteProduct,
} from "../api/products";

export default function Products() {
  const [products, setProducts] = useState<any[]>([]);

  // =========================
  // CATEGORIES
  // =========================

  const categories = [
    { id: "cat-beauty", name: "Beauty" },
    {
      id: "cat-electronics",
      name: "Electronics",
    },
    {
      id: "cat-fashion",
      name: "Fashion",
    },
    {
      id: "cat-home-kitchen",
      name: "Home",
    },
  ];

  // =========================
  // CREATE PRODUCT FORM
  // =========================

  const [form, setForm] = useState({
    name: "",
    categoryId: "",
    price: "",
    stock: "",
    description: "",
  });

  const [image, setImage] =
    useState<File | null>(null);

  const [imagePreview, setImagePreview] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [loadingProducts, setLoadingProducts] =
    useState(true);

  const [deletingProductId, setDeletingProductId] =
    useState<string | null>(null);

  const [error, setError] = useState("");

  // =========================
  // PRICE RANGE FILTER
  // =========================

  const [priceRange, setPriceRange] =
    useState("all");

  // =========================
  // LOAD PRODUCTS
  // =========================

  const load = async () => {
    try {
      setLoadingProducts(true);
      setError("");

      const data = await getVendorProducts();

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

  // =========================
  // PRICE RANGE FILTER
  // =========================

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const price = Number(product.price);

      if (priceRange === "all") {
        return true;
      }

      if (priceRange === "under20") {
        return price < 20000;
      }

      if (priceRange === "20to40") {
        return (
          price >= 20000 &&
          price < 40000
        );
      }

      if (priceRange === "40to60") {
        return (
          price >= 40000 &&
          price <= 60000
        );
      }

      if (priceRange === "above60") {
        return price > 60000;
      }

      return true;
    });
  }, [products, priceRange]);

  // =========================
  // HANDLE IMAGE SELECTION
  // =========================

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) {
      setImage(null);
      setImagePreview("");
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert(
        "Please select a valid image file."
      );

      e.target.value = "";
      setImage(null);
      setImagePreview("");

      return;
    }

    // Validate file size - 10 MB
    if (file.size > 10 * 1024 * 1024) {
      alert(
        "Image size must be less than 10 MB."
      );

      e.target.value = "";
      setImage(null);
      setImagePreview("");

      return;
    }

    setImage(file);

    setImagePreview(
      URL.createObjectURL(file)
    );
  };

  // =========================
  // CREATE PRODUCT
  // =========================

  const handleCreate = async () => {
    // Product name validation
    if (!form.name.trim()) {
      alert(
        "Product name is required."
      );
      return;
    }

    // Category validation
    if (!form.categoryId) {
      alert(
        "Please select a category."
      );
      return;
    }

    // Price validation
    if (!form.price) {
      alert(
        "Product price is required."
      );
      return;
    }

    // Stock validation
    if (!form.stock) {
      alert(
        "Product stock is required."
      );
      return;
    }

    try {
      setLoading(true);

      let imageUrl = "";

      // =========================
      // STEP 1:
      // UPLOAD IMAGE
      // =========================

      if (image) {
        console.log(
          "Uploading product image..."
        );

        const uploadResponse =
          await uploadProductImage(image);

        console.log(
          "Image upload response:",
          uploadResponse
        );

        imageUrl = uploadResponse?.url;

        if (!imageUrl) {
          throw new Error(
            "Image upload succeeded but no image URL was returned."
          );
        }

        console.log(
          "MinIO image URL:",
          imageUrl
        );
      }

      // =========================
      // STEP 2:
      // CREATE PRODUCT
      // =========================

      await createProduct({
        name: form.name.trim(),

        categoryId: form.categoryId,

        price: Number(form.price),

        stock: Number(form.stock),

        description:
          form.description.trim(),

        images: imageUrl
          ? [imageUrl]
          : [],
      });

      alert(
        "Product created successfully ✅"
      );

      // =========================
      // RESET FORM
      // =========================

      setForm({
        name: "",
        categoryId: "",
        price: "",
        stock: "",
        description: "",
      });

      setImage(null);
      setImagePreview("");

      // =========================
      // RELOAD PRODUCTS
      // =========================

      await load();
    } catch (err: any) {
      console.error(
        "Failed to create product:",
        err
      );

      alert(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to create product."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // DELETE PRODUCT
  // =========================

  const handleDelete = async (
    productId: string,
    productName: string
  ) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${productName}"?\n\nThis action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingProductId(productId);
      setError("");

      console.log(
        "Deleting product:",
        productId
      );

      await deleteProduct(productId);

      alert(
        "Product deleted successfully ✅"
      );

      // Remove product immediately
      // from frontend list
      setProducts((currentProducts) =>
        currentProducts.filter(
          (product) =>
            product.id !== productId
        )
      );
    } catch (err: any) {
      console.error(
        "Failed to delete product:",
        err
      );

      alert(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to delete product."
      );
    } finally {
      setDeletingProductId(null);
    }
  };

  return (
    <div>
      {/* =========================
          PAGE TITLE
      ========================= */}

      <h1
        style={{
          fontSize: "28px",
          fontWeight: "bold",
          marginBottom: "20px",
        }}
      >
        My Products
      </h1>

      {/* =========================
          CREATE PRODUCT
      ========================= */}

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
          {/* =========================
              PRODUCT NAME
          ========================= */}

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
              border:
                "1px solid #d1d5db",
              borderRadius: "6px",
            }}
          />

          {/* =========================
              CATEGORY
          ========================= */}

          <select
            value={form.categoryId}
            onChange={(e) =>
              setForm({
                ...form,
                categoryId: e.target.value,
              })
            }
            disabled={loading}
            style={{
              padding: "10px",
              border:
                "1px solid #d1d5db",
              borderRadius: "6px",
              background: "white",
            }}
          >
            <option value="">
              Select Category
            </option>

            {categories.map(
              (category) => (
                <option
                  key={category.id}
                  value={category.id}
                >
                  {category.name}
                </option>
              )
            )}
          </select>

          {/* =========================
              PRICE
          ========================= */}

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
            min="0"
            style={{
              padding: "10px",
              border:
                "1px solid #d1d5db",
              borderRadius: "6px",
            }}
          />

          {/* =========================
              STOCK
          ========================= */}

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
            min="0"
            style={{
              padding: "10px",
              border:
                "1px solid #d1d5db",
              borderRadius: "6px",
            }}
          />

          {/* =========================
              DESCRIPTION
          ========================= */}

          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) =>
              setForm({
                ...form,
                description:
                  e.target.value,
              })
            }
            disabled={loading}
            style={{
              padding: "10px",
              border:
                "1px solid #d1d5db",
              borderRadius: "6px",
              minHeight: "80px",
            }}
          />

          {/* =========================
              IMAGE
          ========================= */}

          <div>
            <label
              style={{
                display: "block",
                fontWeight: "bold",
                marginBottom: "6px",
              }}
            >
              Product Image
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={
                handleImageChange
              }
              disabled={loading}
            />

            <p
              style={{
                fontSize: "13px",
                color: "#6b7280",
                marginTop: "5px",
              }}
            >
              Maximum size: 10 MB
            </p>
          </div>

          {/* =========================
              IMAGE PREVIEW
          ========================= */}

          {imagePreview && (
            <div>
              <p
                style={{
                  fontWeight: "bold",
                  marginBottom: "6px",
                }}
              >
                Image Preview
              </p>

              <img
                src={imagePreview}
                alt="Product preview"
                style={{
                  width: "180px",
                  height: "180px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  border:
                    "1px solid #d1d5db",
                }}
              />
            </div>
          )}

          {/* =========================
              CREATE BUTTON
          ========================= */}

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
              ? image
                ? "Uploading & Creating..."
                : "Creating..."
              : "Create Product"}
          </button>
        </div>
      </div>

      {/* =========================
          PRODUCT LIST TITLE
      ========================= */}

      <h2
        style={{
          fontSize: "20px",
          fontWeight: "bold",
          marginBottom: "15px",
        }}
      >
        My Product List
      </h2>

      {/* =========================
          PRICE RANGE FILTER
      ========================= */}

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "8px",
          marginBottom: "20px",
        }}
      >
        {/* ALL */}

        <button
          onClick={() =>
            setPriceRange("all")
          }
          style={{
            padding: "9px 16px",
            borderRadius: "6px",
            border:
              "1px solid #d1d5db",
            background:
              priceRange === "all"
                ? "#111827"
                : "white",
            color:
              priceRange === "all"
                ? "white"
                : "#111827",
            cursor: "pointer",
            fontWeight:
              priceRange === "all"
                ? "bold"
                : "normal",
          }}
        >
          All
        </button>

        {/* UNDER 20K */}

        <button
          onClick={() =>
            setPriceRange("under20")
          }
          style={{
            padding: "9px 16px",
            borderRadius: "6px",
            border:
              "1px solid #d1d5db",
            background:
              priceRange === "under20"
                ? "#111827"
                : "white",
            color:
              priceRange === "under20"
                ? "white"
                : "#111827",
            cursor: "pointer",
            fontWeight:
              priceRange === "under20"
                ? "bold"
                : "normal",
          }}
        >
          Under ₹20,000
        </button>

        {/* 20K - 40K */}

        <button
          onClick={() =>
            setPriceRange("20to40")
          }
          style={{
            padding: "9px 16px",
            borderRadius: "6px",
            border:
              "1px solid #d1d5db",
            background:
              priceRange === "20to40"
                ? "#111827"
                : "white",
            color:
              priceRange === "20to40"
                ? "white"
                : "#111827",
            cursor: "pointer",
            fontWeight:
              priceRange === "20to40"
                ? "bold"
                : "normal",
          }}
        >
          ₹20,000 - ₹40,000
        </button>

        {/* 40K - 60K */}

        <button
          onClick={() =>
            setPriceRange("40to60")
          }
          style={{
            padding: "9px 16px",
            borderRadius: "6px",
            border:
              "1px solid #d1d5db",
            background:
              priceRange === "40to60"
                ? "#111827"
                : "white",
            color:
              priceRange === "40to60"
                ? "white"
                : "#111827",
            cursor: "pointer",
            fontWeight:
              priceRange === "40to60"
                ? "bold"
                : "normal",
          }}
        >
          ₹40,000 - ₹60,000
        </button>

        {/* ABOVE 60K */}

        <button
          onClick={() =>
            setPriceRange("above60")
          }
          style={{
            padding: "9px 16px",
            borderRadius: "6px",
            border:
              "1px solid #d1d5db",
            background:
              priceRange === "above60"
                ? "#111827"
                : "white",
            color:
              priceRange === "above60"
                ? "white"
                : "#111827",
            cursor: "pointer",
            fontWeight:
              priceRange === "above60"
                ? "bold"
                : "normal",
          }}
        >
          Above ₹60,000
        </button>
      </div>

      {/* =========================
          LOADING
      ========================= */}

      {loadingProducts && (
        <p>Loading products...</p>
      )}

      {/* =========================
          ERROR
      ========================= */}

      {error && (
        <p
          style={{
            color: "#dc2626",
          }}
        >
          {error}
        </p>
      )}

      {/* =========================
          NO PRODUCTS
      ========================= */}

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

      {/* =========================
          NO PRODUCTS IN FILTER
      ========================= */}

      {!loadingProducts &&
        !error &&
        products.length > 0 &&
        filteredProducts.length === 0 && (
          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "8px",
              color: "#6b7280",
            }}
          >
            No products found in this
            price range.
          </div>
        )}

      {/* =========================
          PRODUCT LIST
      ========================= */}

      <div
        style={{
          display: "grid",
          gap: "12px",
        }}
      >
        {filteredProducts.map((p) => (
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
            {/* =========================
                PRODUCT IMAGE
            ========================= */}

            {p.images?.length > 0 && (
              <img
                src={p.images[0].url}
                alt={p.name}
                style={{
                  width: "160px",
                  height: "160px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  marginBottom: "12px",
                }}
              />
            )}

            {/* =========================
                PRODUCT NAME
            ========================= */}

            <h3
              style={{
                fontWeight: "bold",
                fontSize: "18px",
              }}
            >
              {p.name}
            </h3>

            {/* =========================
                CATEGORY
            ========================= */}

            {p.category && (
              <p>
                Category:{" "}
                {p.category.name}
              </p>
            )}

            {/* =========================
                PRICE
            ========================= */}

            <p>
              Price: ₹
              {Number(
                p.price
              ).toLocaleString("en-IN")}
            </p>

            {/* =========================
                STOCK
            ========================= */}

            <p>
              Stock: {p.stock}
            </p>

            {/* =========================
                DESCRIPTION
            ========================= */}

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

            {/* =========================
                DELETE BUTTON
            ========================= */}

            <div
              style={{
                display: "flex",
                gap: "10px",
                marginTop: "15px",
              }}
            >
              <button
                onClick={() =>
                  handleDelete(
                    p.id,
                    p.name
                  )
                }
                disabled={
                  deletingProductId ===
                  p.id
                }
                style={{
                  padding: "9px 16px",
                  background:
                    deletingProductId ===
                    p.id
                      ? "#9ca3af"
                      : "#dc2626",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor:
                    deletingProductId ===
                    p.id
                      ? "not-allowed"
                      : "pointer",
                  fontWeight: "bold",
                }}
              >
                {deletingProductId ===
                p.id
                  ? "Deleting..."
                  : "Delete"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
