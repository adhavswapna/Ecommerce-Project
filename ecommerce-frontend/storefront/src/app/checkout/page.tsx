"use client";

import { useCart } from "@/hooks/useCart";
import { createOrder } from "@/api/checkout";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const { cartItems } = useCart();
  const router = useRouter();

  const handleCheckout = async () => {
    try {
      if (!cartItems || cartItems.length === 0) {
        alert("Cart is empty");
        return;
      }

      // 🔥 TODO: Replace with JWT user later
      const userId = "test-user-id";

      const totalAmount = cartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );

      const payload = {
        userId,
        totalAmount,
        currency: "INR",
        paymentMethod: "COD",
        items: cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
      };

      console.log("🚀 Sending Order Payload:", payload);

      const order = await createOrder(payload);

      console.log("✅ Order Created:", order);

      // ✅ Redirect to payment
      router.push(`/payments?orderId=${order.id}`);
    } catch (err: any) {
      console.error("❌ Checkout Error:", err?.response?.data || err);

      alert(
        err?.response?.data?.message ||
          "Checkout failed ❌ Check console"
      );
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>

      {/* 🧾 Cart Summary */}
      <div className="border rounded p-4 mb-4">
        {cartItems.map((item) => (
          <div
            key={item.productId}
            className="flex justify-between mb-2"
          >
            <span>
              {item.name} x {item.quantity}
            </span>
            <span>₹{item.price * item.quantity}</span>
          </div>
        ))}

        <hr className="my-2" />

        <div className="flex justify-between font-bold">
          <span>Total</span>
          <span>
            ₹
            {cartItems.reduce(
              (acc, item) => acc + item.price * item.quantity,
              0
            )}
          </span>
        </div>
      </div>

      {/* 🚀 Checkout Button */}
      <button
        onClick={handleCheckout}
        className="w-full bg-black text-white px-6 py-3 rounded hover:bg-gray-800"
      >
        Proceed to Payment
      </button>
    </div>
  );
}
