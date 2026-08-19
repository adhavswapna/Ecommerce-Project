import { useState } from "react";
import { createVendor } from "../api/vendors";

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

  const submit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    /* =================================================
       VALIDATION
    ================================================= */

    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.password
    ) {
      alert(
        "Name, Email and Password are required"
      );
      return;
    }

    if (form.password.length < 8) {
      alert(
        "Password must be at least 8 characters"
      );
      return;
    }

    /* =================================================
       CHECK ADMIN LOGIN
    ================================================= */

    const adminToken =
      localStorage.getItem("adminToken");

    if (!adminToken) {
      alert(
        "Admin login token not found. Please login as Admin."
      );
      return;
    }

    /* =================================================
       START LOADING
    ================================================= */

    setLoading(true);

    try {
      console.log(
        "=============================================="
      );

      console.log(
        "🚀 Creating vendor..."
      );

      /* =================================================
         CREATE AUTH + VENDOR
      ================================================= */

      const result = await createVendor({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        phone: form.phone.trim(),
        address: form.address.trim(),
      });

      /* =================================================
         SUCCESS
      ================================================= */

      console.log(
        "🎉 Vendor creation completed:",
        result
      );

      console.log(
        "👤 Auth User ID:",
        result.userId
      );

      console.log(
        "=============================================="
      );

      alert(
        "Vendor created successfully!\n\n" +
        `Name: ${form.name}\n` +
        `Email: ${form.email}\n\n` +
        "The vendor can now login using this email and password.\n\n" +
        "Vendor status is PENDING until Admin approves the vendor."
      );

      /* =================================================
         CLEAR FORM
      ================================================= */

      setForm({
        name: "",
        email: "",
        password: "",
        phone: "",
        address: "",
      });
    } catch (err: any) {
      console.error(
        "❌ Vendor creation failed:",
        err
      );

      /* =================================================
         AXIOS ERROR DETAILS
      ================================================= */

      console.error(
        "Response:",
        err?.response
      );

      console.error(
        "Response data:",
        err?.response?.data
      );

      console.error(
        "Status:",
        err?.response?.status
      );

      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Failed to create vendor";

      alert(
        `Failed to create vendor\n\n${message}`
      );
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
      <h2>
        Create Vendor
      </h2>

      <p>
        Create a vendor authentication account
        and vendor business profile.
      </p>

      <form onSubmit={submit}>
        {/* =================================================
            NAME
        ================================================= */}

        <div
          style={{
            marginBottom: "15px",
          }}
        >
          <label>
            Name
          </label>

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

        {/* =================================================
            EMAIL
        ================================================= */}

        <div
          style={{
            marginBottom: "15px",
          }}
        >
          <label>
            Email
          </label>

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

        {/* =================================================
            PASSWORD
        ================================================= */}

        <div
          style={{
            marginBottom: "15px",
          }}
        >
          <label>
            Password
          </label>

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

          <small>
            Minimum 8 characters
          </small>
        </div>

        {/* =================================================
            PHONE
        ================================================= */}

        <div
          style={{
            marginBottom: "15px",
          }}
        >
          <label>
            Phone
          </label>

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

        {/* =================================================
            ADDRESS
        ================================================= */}

        <div
          style={{
            marginBottom: "15px",
          }}
        >
          <label>
            Address
          </label>

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

        {/* =================================================
            SUBMIT
        ================================================= */}

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
