import API from "../services/api";

export const createProduct = async (
  payload: any
) => {
  const { data } = await API.post(
    "/products",
    payload
  );

  return data;
};

export const getVendorProducts = async () => {
  const { data } = await API.get(
    "/products/vendor"
  );

  return data.data ?? data;
};

/**
 * Delete product
 */
export const deleteProduct = async (
  productId: string
) => {
  const { data } = await API.delete(
    `/products/${productId}`
  );

  return data;
};

/**
 * Upload product image to Product Service.
 *
 * Flow:
 * Vendor Dashboard
 *      ↓
 * Nginx /api/upload/image
 *      ↓
 * Product Service
 *      ↓
 * MinIO
 */
export const uploadProductImage = async (
  file: File
) => {
  const formData = new FormData();

  formData.append("image", file);

  const { data } = await API.post(
    "/upload/image",
    formData,
    {
      headers: {
        "Content-Type":
          "multipart/form-data",
      },
    }
  );

  return data;
};
