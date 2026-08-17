import { useState } from "react";
import API from "../api/client";

export default function CreateVendor() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);

  const updateField = (
    field: keyof typeof form,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      alert("Name, Email and Password are required");
      return;
    }

    if (form.password.length < 8) {
      alert("Password must be at least 8 characters");
      return;
    }

    const adminToken = localStorage.getItem("adminToken");

    if (!adminToken) {
      alert("Admin login token not found. Please login as Admin.");
      return;
    }

    setLoading(true);

    try {
      // =====================================================
      // STEP 1
      // Create vendor authentication account
      // =====================================================

      const authResponse = await API.post(
        "/auth/register/vendor",
        {
          name: form.name,
          email: form.email,
          password: form.password,
          phone: form.phone,
          address: form.address,
        },
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      console.log(
        "Auth Service Response:",
        authResponse.data
      );

      const userId =
        authResponse.data?.data?.userId;

      if (!userId) {
        throw new Error(
          "Vendor authentication account was created, but userId was not returned."
        );
      }

      // =====================================================
      // STEP 2
      // Create vendor profile
      // =====================================================

      const vendorResponse = await API.post(
        "/vendors/create",
        {
          name: form.name,
          email: form.email,
          phone: form.phone,
          address: form.address,
          userId,
        },
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      console.log(
        "Vendor Service Response:",
        vendorResponse.data
      );

      // =====================================================
      // SUCCESS
      // =====================================================

      alert(
        "Vendor created successfully!\n\n" +
        `Name: ${form.name}\n` +
        `Email: ${form.email}\n\n` +
        "The vendor can now login using this email and password."
      );

      setForm({
        name: "",
        email: "",
        password: "",
        phone: "",
        address: "",
      });
    } catch (err: any) {
      console.error(
        "Error creating vendor:",
        err
      );

      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to create vendor";

      alert(`Failed to create vendor\n\n${message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "20px auto",
      }}
    >
      <h2>Create Vendor</h2>

      <p>
        Create a vendor authentication account and
        vendor business profile.
      </p>

      <form onSubmit={submit}>

        <div style={{ marginBottom: "15px" }}>
          <label>Name</label>

          <br />

          <input
            type="text"
            placeholder="Vendor Name"
            value={form.name}
            onChange={(e) =>
              updateField(
                "name",
                e.target.value
              )
            }
            disabled={loading}
            style={{
              width: "100%",
              padding: "8px",
            }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Email</label>

          <br />

          <input
            type="email"
            placeholder="Vendor Email"
            value={form.email}
            onChange={(e) =>
              updateField(
                "email",
                e.target.value
              )
            }
            disabled={loading}
            style={{
              width: "100%",
              padding: "8px",
            }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Password</label>

          <br />

          <input
            type="password"
            placeholder="Vendor Password"
            value={form.password}
            onChange={(e) =>
              updateField(
                "password",
                e.target.value
              )
            }
            disabled={loading}
            style={{
              width: "100%",
              padding: "8px",
            }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Phone</label>

          <br />

          <input
            type="text"
            placeholder="Phone Number"
            value={form.phone}
            onChange={(e) =>
              updateField(
                "phone",
                e.target.value
              )
            }
            disabled={loading}
            style={{
              width: "100%",
              padding: "8px",
            }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Address</label>

          <br />

          <input
            type="text"
            placeholder="Vendor Address"
            value={form.address}
            onChange={(e) =>
              updateField(
                "address",
                e.target.value
              )
            }
            disabled={loading}
            style={{
              width: "100%",
              padding: "8px",
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "10px 20px",
            cursor: loading
              ? "not-allowed"
              : "pointer",
          }}
        >
          {loading
            ? "Creating Vendor..."
            : "Create Vendor"}
        </button>
      </form>
    </div>
  );
}
