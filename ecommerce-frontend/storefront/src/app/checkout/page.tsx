"use client";

import { useCart } from "@/hooks/useCart";
import { createOrder, confirmOrder } from "@/api/checkout";
import { createPayment } from "@/api/payments";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const { cartItems } = useCart();
  const router = useRouter();

  const handleCheckout = async () => {
    try {
      if (cartItems.length === 0) {
        alert("Cart is empty");
        return;
      }

      // 1️⃣ Create Order
      const order = await createOrder({
        userId: "USER_ID", // backend can extract from token
        totalAmount: cartItems.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0
        ),
        paymentMethod: "COD",
        items: cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
        address: "Mumbai, India",
      });

      // 2️⃣ Create Payment
      await createPayment({
        userId: order.userId,
        orderId: order.id,
        amount: order.totalAmount,
        provider: "COD",
        currency: "INR",
      });

      // 3️⃣ Confirm Order
      await confirmOrder(order.id);

      alert("Order placed successfully ✅");

      // ✅ FIX: Redirect to payments page
      router.push(`/payments?orderId=${order.id}`);

    } catch (err) {
      console.error(err);
      alert("Checkout failed ❌");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Checkout</h1>

      <button
        onClick={handleCheckout}
        className="mt-6 bg-black text-white px-6 py-3 rounded"
      >
        Place Order
      </button>
    </div>
  );
}
