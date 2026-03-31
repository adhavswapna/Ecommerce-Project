"use client";

interface CheckoutItemProps {
  item: {
    id: string;
    productId: string;
    productName?: string;
    price: number;
    quantity: number;
    image?: string;
  };
}

export default function CheckoutItem({ item }: CheckoutItemProps) {
  return (
    <div className="flex items-center justify-between border p-4 rounded-lg bg-white">
      <div className="flex items-center gap-4">
        {item.image ? (
          <img
            src={item.image}
            alt={item.productName || "Product"}
            className="w-16 h-16 object-cover rounded"
          />
        ) : (
          <div className="w-16 h-16 bg-gray-100 flex items-center justify-center text-gray-400 text-sm rounded">
            No Img
          </div>
        )}

        <div>
          <p className="font-semibold">
            {item.productName || item.productId}
          </p>
          <p className="text-sm text-gray-500">
            ₹{item.price} × {item.quantity}
          </p>
        </div>
      </div>

      <p className="font-bold">
        ₹{item.price * item.quantity}
      </p>
    </div>
  );
}
