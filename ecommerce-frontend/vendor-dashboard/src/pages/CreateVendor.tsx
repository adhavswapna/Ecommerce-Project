import { useState } from "react";
import { API } from "../services/api";

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

    if (
      !form.name ||
      !form.email ||
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

    setLoading(true);

    try {
      /*
       * STEP 1
       * Create authentication account.
       *
       * This creates AuthUser with:
       * role = VENDOR
       * password = hashed
       *
       * The response contains userId.
       */

      const authResponse = await API.post(
        "/auth/register/vendor",
        {
          name: form.name,
          email: form.email,
          password: form.password,
          phone: form.phone,
          address: form.address,
        }
      );

      const userId =
        authResponse.data?.userId;

      if (!userId) {
        throw new Error(
          "Vendor account created but userId was not returned"
        );
      }

      /*
       * STEP 2
       * Create Vendor profile.
       *
       * userId is automatically taken from
       * the Auth Service response.
       *
       * User does NOT need to enter userId.
       */

      await API.post("/vendors/create", {
        name: form.name,
        email: form.email,
        phone: form.phone,
        address: form.address,
        userId,
      });

      alert(
        "Vendor Created Successfully ✅\n\n" +
        "The vendor can now login using the email and password."
      );

      // Clear form
      setForm({
        name: "",
        email: "",
        password: "",
        phone: "",
        address: "",
      });
    } catch (err: any) {
      console.error(
        "❌ Error creating vendor:",
        err
      );

      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Error creating vendor";

      alert(`❌ ${message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Create Vendor</h2>

      <form onSubmit={submit}>
        {/* Name */}

        <div>
          <label>Name</label>

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
          />
        </div>

        {/* Email */}

        <div>
          <label>Email</label>

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
          />
        </div>

        {/* Password */}

        <div>
          <label>Password</label>

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
          />
        </div>

        {/* Phone */}

        <div>
          <label>Phone</label>

          <input
            type="text"
            placeholder="Phone"
            value={form.phone}
            onChange={(e) =>
              updateField(
                "phone",
                e.target.value
              )
            }
          />
        </div>

        {/* Address */}

        <div>
          <label>Address</label>

          <input
            type="text"
            placeholder="Address"
            value={form.address}
            onChange={(e) =>
              updateField(
                "address",
                e.target.value
              )
            }
          />
        </div>

        {/* Submit */}

        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Creating Vendor..."
            : "Create Vendor"}
        </button>
      </form>
    </div>
  );
}
