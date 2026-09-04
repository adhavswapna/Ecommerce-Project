import API from "../services/api";

/* =====================================================
   VENDOR REGISTRATION
===================================================== */

export interface VendorRegistrationData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
}

export const registerVendor = async (
  vendor: VendorRegistrationData
) => {
  const { data } = await API.post(
    "/auth/register/vendor",
    {
      name: vendor.name.trim(),
      email: vendor.email.trim(),
      password: vendor.password,
      phone: vendor.phone?.trim() || "",
      address: vendor.address?.trim() || "",
    }
  );

  return data;
};

/* =====================================================
   VENDOR LOGIN
===================================================== */

export const login = async (
  email: string,
  password: string
) => {
  const { data } = await API.post(
    "/auth/login",
    {
      email,
      password,
    }
  );

  if (!data?.token) {
    return data;
  }

  /* -----------------------------------------------------
     Save JWT token
  ----------------------------------------------------- */

  localStorage.setItem(
    "vendorToken",
    data.token
  );

  /* -----------------------------------------------------
     Backend currently returns only the token.
     Decode the JWT payload to get vendor information.
  ----------------------------------------------------- */

  try {
    const payload = JSON.parse(
      atob(
        data.token
          .split(".")[1]
          .replace(/-/g, "+")
          .replace(/_/g, "/")
      )
    );

    const vendorUser = {
      id: payload.userId,
      userId: payload.userId,
      role: payload.role,
      name: payload.name,
      email: payload.email,
    };

    localStorage.setItem(
      "vendorUser",
      JSON.stringify(vendorUser)
    );

    console.log("Vendor user saved:", vendorUser);
  } catch (error) {
    console.error(
      "Failed to decode vendor JWT:",
      error
    );

    localStorage.removeItem("vendorToken");
    localStorage.removeItem("vendorUser");

    throw new Error(
      "Invalid login token received from server."
    );
  }

  return data;
};
