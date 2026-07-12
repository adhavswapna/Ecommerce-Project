import { useEffect, useState } from "react";
import {
  getVendorProducts,
  createProduct,
} from "../api/products";

export default function Products() {
  const [products, setProducts] = useState<any[]>([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    description: "",
  });

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const data = await getVendorProducts();
    setProducts(data);
  };

  const handleCreate = async () => {
    await createProduct({
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
    });

    setForm({ name: "", price: "", stock: "", description: "" });
    load();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My Products</h1>

      {/* CREATE FORM */}
      <div className="bg-white p-4 shadow rounded mb-6">
        <h2 className="font-semibold mb-2">Add Product</h2>

        <div className="grid gap-2">
          <input
            placeholder="Name"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <input
            placeholder="Price"
            value={form.price}
            onChange={(e) =>
              setForm({ ...form, price: e.target.value })
            }
          />

          <input
            placeholder="Stock"
            value={form.stock}
            onChange={(e) =>
              setForm({ ...form, stock: e.target.value })
            }
          />

          <input
            placeholder="Description"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />

          <button
            onClick={handleCreate}
            className="bg-black text-white p-2"
          >
            Create Product
          </button>
        </div>
      </div>

      {/* LIST */}
      <div className="grid gap-3">
        {products.map((p) => (
          <div
            key={p.id}
            className="p-4 bg-gray-100 rounded flex justify-between"
          >
            <div>
              <h3 className="font-bold">{p.name}</h3>
              <p>₹{p.price}</p>
              <p>Stock: {p.stock}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
