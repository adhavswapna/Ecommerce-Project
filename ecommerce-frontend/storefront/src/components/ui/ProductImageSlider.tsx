"use client";

import { useState } from "react";
import Image from "next/image";

import {
  Swiper,
  SwiperSlide,
} from "swiper/react";

import {
  Navigation,
  Pagination,
  Thumbs,
} from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface ProductImage {
  url: string;
}

interface Props {
  images: ProductImage[];
  name: string;
}

export default function ProductImageSlider({
  images,
  name,
}: Props) {
  const [thumbsSwiper, setThumbsSwiper] =
    useState<any>(null);

  const validImages = Array.isArray(images)
    ? images.filter(
        (img) =>
          img &&
          typeof img.url === "string" &&
          img.url.trim().length > 0
      )
    : [];

  if (validImages.length === 0) {
    return (
      <div className="h-[500px] bg-gray-100 rounded-xl flex items-center justify-center">
        <div className="text-center text-gray-400">
          <div className="text-5xl">📦</div>

          <p className="mt-2 text-sm">
            No Image Available
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-[90px_1fr] gap-4">
      {/* THUMBNAILS */}

      <div className="hidden md:block">
        <Swiper
          onSwiper={setThumbsSwiper}
          direction="vertical"
          slidesPerView={5}
          spaceBetween={15}
          modules={[Thumbs]}
          className="h-[520px]"
        >
          {validImages.map((img, index) => (
            <SwiperSlide key={`${img.url}-${index}`}>
              <div className="relative h-20 rounded-xl overflow-hidden border bg-white">
                <Image
                  src={img.url}
                  alt={`${name} thumbnail ${index + 1}`}
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* MAIN IMAGE */}

      <div className="bg-white rounded-2xl overflow-hidden shadow">
        <Swiper
          modules={[
            Navigation,
            Pagination,
            Thumbs,
          ]}
          navigation={validImages.length > 1}
          pagination={
            validImages.length > 1
              ? { clickable: true }
              : false
          }
          thumbs={{
            swiper:
              thumbsSwiper &&
              !thumbsSwiper.destroyed
                ? thumbsSwiper
                : null,
          }}
          className="h-[520px]"
        >
          {validImages.map((img, index) => (
            <SwiperSlide
              key={`${img.url}-main-${index}`}
            >
              <ProductImage
                src={img.url}
                alt={`${name}-${index + 1}`}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}

/* =====================================================
   SAFE PRODUCT IMAGE
===================================================== */

function ProductImage({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className="h-[520px] flex flex-col items-center justify-center bg-gray-100 text-gray-400">
        <div className="text-5xl">📦</div>

        <p className="mt-2 text-sm">
          No Image Available
        </p>
      </div>
    );
  }

  return (
    <div className="relative h-[520px] w-full flex items-center justify-center p-10">
      <Image
        src={src}
        alt={alt}
        fill
        unoptimized
        className="object-contain"
        onError={() => setError(true)}
      />
    </div>
  );
}
