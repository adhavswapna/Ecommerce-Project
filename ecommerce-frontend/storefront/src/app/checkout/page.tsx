
"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/auth.store";

import { createCheckoutOrder } from "@/api/checkout";

export default function CheckoutPage() {
  const router = useRouter();

  const user = useAuthStore((state) => state.user);

  const {
    items,
    cartTotal,
    address,
    setAddress,
  } = useCartStore();

  const [loading, setLoading] = useState(false);

  const placing = useRef(false);

  // ==========================================
  // UPDATE ADDRESS
  // ==========================================

  const updateAddress = (
    field: string,
    value: string
  ) => {
    setAddress({
      ...address,
      [field]: value,
    });
  };

  // ==========================================
  // PLACE ORDER
  // ==========================================

  const placeOrder = async () => {
    // Prevent double-click
    if (placing.current) {
      console.log("⚠️ Order is already being placed");
      return;
    }

    placing.current = true;
    setLoading(true);

    try {
      console.log("=================================");
      console.log("🚀 PLACE ORDER CLICKED");
      console.log("=================================");

      // ========================================
      // CHECK USER
      // ========================================

      console.log("👤 User:", user);

      if (!user?.id) {
        console.log("❌ No logged-in user");

        toast.error("Please login first");

        router.push("/login");

        return;
      }

      // ========================================
      // CHECK CART
      // ========================================

      console.log("🛒 Cart items:", items);

      if (!items.length) {
        console.log("❌ Cart is empty");

        toast.error("Cart is empty");

        return;
      }

      // ========================================
      // CHECK ADDRESS
      // ========================================

      console.log("📍 Address:", address);

      if (
        !address.addressLine1 ||
        !address.city ||
        !address.phone
      ) {
        console.log(
          "❌ Required address fields are missing"
        );

        toast.error(
          "Please fill delivery address"
        );

        return;
      }

      // ========================================
      // CALCULATE TOTAL
      // ========================================

      const total = cartTotal();

      console.log("💰 Cart total:", total);

      // ========================================
      // CREATE ORDER
      // ========================================

      const orderPayload = {
        userId: user.id,

        totalAmount: total,

        paymentMethod: "ONLINE",

        currency: "INR",

        address,

        items: items.map((item) => ({
          productId: item.productId,

          quantity: item.quantity,

          price: item.price,
        })),
      };

      console.log(
        "📦 Sending order payload:",
        orderPayload
      );

      const order =
        await createCheckoutOrder(
          orderPayload
        );

      // ========================================
      // ORDER RESPONSE
      // ========================================

      console.log(
        "✅ ORDER RESPONSE:",
        order
      );

      // Some APIs return:
      // { id: "..." }
      //
      // Others return:
      // { orderId: "..." }

      const orderId =
        order?.id ||
        order?.orderId;

      console.log(
        "🆔 ORDER ID:",
        orderId
      );

      // ========================================
      // VALIDATE ORDER ID
      // ========================================

      if (!orderId) {
        console.error(
          "❌ Order created but no order ID was returned"
        );

        throw new Error(
          "Order creation failed: Order ID missing"
        );
      }

      // ========================================
      // ORDER CREATED
      // ========================================

      toast.success(
        "Order created successfully"
      );

      // ========================================
      // PAYMENT PAGE URL
      // ========================================

      const paymentUrl =
        `/payments?orderId=${encodeURIComponent(
          orderId
        )}&amount=${encodeURIComponent(
          total
        )}`;

      console.log(
        "➡️ PAYMENT URL:",
        paymentUrl
      );

      console.log(
        "➡️ Redirecting to payment page..."
      );

      // ========================================
      // REDIRECT
      // ========================================

      router.push(paymentUrl);

    } catch (error: any) {

      console.error(
        "❌ CHECKOUT ERROR:",
        error
      );

      console.error(
        "❌ ERROR MESSAGE:",
        error?.message
      );

      console.error(
        "❌ SERVER RESPONSE:",
        error?.response?.data
      );

      console.error(
        "❌ HTTP STATUS:",
        error?.response?.status
      );

      toast.error(
        error?.response?.data?.message ||
        error?.message ||
        "Checkout failed"
      );

    } finally {

      placing.current = false;

      setLoading(false);

      console.log(
        "🏁 Place Order process finished"
      );
    }
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <main className="min-h-screen bg-gray-50 p-6">

      <div className="max-w-6xl mx-auto">

        <h1 className="text-3xl font-bold mb-8">
          Checkout
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* =================================
              DELIVERY ADDRESS
          ================================= */}

          <div className="lg:col-span-2">

            <div className="bg-white border rounded-2xl p-6">

              <h2 className="text-xl font-bold mb-5">
                Delivery Address
              </h2>

              {[
                "addressLine1",
                "city",
                "state",
                "pincode",
                "phone",
              ].map((field) => (

                <input
                  key={field}
                  value={
                    (address as any)[field] || ""
                  }
                  placeholder={field}
                  onChange={(e) =>
                    updateAddress(
                      field,
                      e.target.value
                    )
                  }
                  className="
                    border
                    p-3
                    rounded-xl
                    w-full
                    mb-3
                  "
                />

              ))}

            </div>

          </div>

          {/* =================================
              ORDER SUMMARY
          ================================= */}

          <div
            className="
              bg-white
              border
              rounded-2xl
              p-6
              h-fit
            "
          >

            <h2 className="font-bold text-xl">
              Summary
            </h2>

            {/* ITEMS */}

            <div className="mt-5 flex justify-between">

              <span>
                Items
              </span>

              <span>
                {items.length}
              </span>

            </div>

            {/* TOTAL */}

            <div
              className="
                mt-5
                border-t
                pt-5
                flex
                justify-between
                text-2xl
                font-bold
              "
            >

              <span>
                Total
              </span>

              <span>
                ₹{cartTotal()}
              </span>

            </div>

            {/* PLACE ORDER */}

            <button
              disabled={
                loading ||
                !items.length
              }
              onClick={placeOrder}
              className="
                mt-6
                w-full
                bg-yellow-400
                hover:bg-yellow-500
                py-3
                rounded-full
                font-bold
                disabled:opacity-50
                disabled:cursor-not-allowed
              "
            >

              {loading
                ? "Placing Order..."
                : "Place Order"}

            </button>

          </div>

        </div>

      </div>

    </main>
  );
}

