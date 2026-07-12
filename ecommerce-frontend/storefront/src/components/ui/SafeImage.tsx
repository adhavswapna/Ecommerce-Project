"use client";

import Image from "next/image";
import { useState } from "react";

interface Props {
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
}

export default function SafeImage({
  src,
  alt = "Product",
  width = 500,
  height = 500,
  className = "",
}: Props) {
  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(false);

  if (!src || error) {
    return (
      <div
        className="
        w-full
        h-full
        min-h-[250px]
        bg-gray-100
        flex
        flex-col
        items-center
        justify-center
        text-gray-400
        "
      >
        <div className="text-5xl">
          📦
        </div>

        <p className="mt-2 text-sm">
          No Image Available
        </p>
      </div>
    );
  }

  return (
    <div
      className="
      relative
      w-full
      h-full
      "
    >
      {loading && (
        <div
          className="
          absolute
          inset-0
          animate-pulse
          bg-gray-200
          rounded
          "
        />
      )}

      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        unoptimized
        loading="lazy"
        onLoadingComplete={() =>
          setLoading(false)
        }
        onError={() =>
          setError(true)
        }
        className={`
          transition-all
          duration-500
          ${
            loading
              ? "opacity-0"
              : "opacity-100"
          }
          ${className}
        `}
      />
    </div>
  );
}
