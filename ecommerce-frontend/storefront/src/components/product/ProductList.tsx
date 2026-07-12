"use client";

import { useEffect } from "react";
import ProductCard from "./ProductCard";
import { useProductStore } from "@/store/productStore";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

export default function ProductList() {
  const {
    products,
    loadingList,
    error,
    fetchProducts,
  } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, []);

  console.log("Products in Store:", products);

  if (loadingList) {
    return (
      <div className="text-center py-10">
        Loading products...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-600">
        {error}
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="text-center py-10">
        No Products Found
      </div>
    );
  }

  return (
    <>
      <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>

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
