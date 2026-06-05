import { productApi } from "./apiClient";

import { Product } from "@/types/product";

export const getProducts =
  async (): Promise<Product[]> => {
    const response =
      await productApi.get(
        "/products"
      );

    return response.data;
  };

export const getProductById =
  async (
    id: string
  ): Promise<Product> => {
    const response =
      await productApi.get(
        `/products/${id}`
      );

    return response.data;
  };

export const createProduct =
  async (
    data: {
      name: string;
      price: number;
      stock: number;
      description?: string;
      vendorId: string;
    }
  ): Promise<Product> => {
    const response =
      await productApi.post(
        "/products",
        data
      );

    return response.data;
  };
