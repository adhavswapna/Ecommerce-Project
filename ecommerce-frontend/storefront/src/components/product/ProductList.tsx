"use client";

import { useEffect } from "react";

import ProductCard from "./ProductCard";

import { useProductStore } from "@/store/productStore";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

interface ProductListProps {
  category?: string;
}

export default function ProductList({
  category,
}: ProductListProps) {
  const {
    products,
    loadingList,
    error,
    fetchProducts,
  } = useProductStore();

  useEffect(() => {
    fetchProducts(category);
  }, [category, fetchProducts]);

  console.log("====================================");
  console.log("📦 PRODUCT LIST");
  console.log("🏷️ Category:", category || "ALL");
  console.log("📦 Products:", products);
  console.log("====================================");

  if (loadingList) {
    return (
      <div className="py-10 text-center">
        Loading products...
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-10 text-center text-red-600">
        {error}
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="py-10 text-center">
        No Products Found
      </div>
    );
  }

  return (
    <>
      {/* DESKTOP */}

      <div className="hidden grid-cols-2 gap-6 md:grid lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>

      {/* MOBILE */}

      <div className="md:hidden">
        <Swiper
          modules={[Navigation]}
          navigation
          spaceBetween={15}
          slidesPerView={1.2}
        >
          {products.map((product) => (
            <SwiperSlide key={product.id}>
              <ProductCard product={product} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  );
}
