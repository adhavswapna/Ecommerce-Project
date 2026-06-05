"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  getProducts,
  getProductById,
} from "@/api/products";

import {
  Product,
} from "@/types/product";

export const useProducts =
  () => {
    const [
      products,
      setProducts,
    ] = useState<Product[]>(
      []
    );

    const [
      product,
      setProduct,
    ] =
      useState<Product | null>(
        null
      );

    const [
      loading,
      setLoading,
    ] = useState(false);

    const fetchProducts =
      async () => {
        try {
          setLoading(true);

          const data =
            await getProducts();

          setProducts(data);
        } catch (
          error
        ) {
          console.error(
            error
          );
        } finally {
          setLoading(false);
        }
      };

    const fetchProduct =
      async (
        id: string
      ) => {
        try {
          setLoading(true);

          const data =
            await getProductById(
              id
            );

          setProduct(data);
        } catch (
          error
        ) {
          console.error(
            error
          );
        } finally {
          setLoading(false);
        }
      };

    useEffect(() => {
      fetchProducts();
    }, []);

    return {
      products,
      product,
      loading,
      fetchProducts,
      fetchProduct,
    };
  };
