import { Product } from "@/types/product";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  return (
    <div className="border rounded-lg p-3">

      {/* PRODUCT INFO ONLY */}
      <h2 className="text-lg font-semibold">
        {product.name}
      </h2>

      <p className="text-gray-600 mt-1">
        ₹{product.price}
      </p>

    </div>
  );
}
