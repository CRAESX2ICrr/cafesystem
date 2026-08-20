"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  CheckCircle,
} from "lucide-react";

import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import API_URL from "../../services/api";

export default function CartPage() {
  const router = useRouter();

  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
  } = useCart();

  const { token } = useAuth();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleCheckout = async () => {
    if (!token) {
      const goToLogin = window.confirm(
        "You need to log in before placing an order. Go to the login page?"
      );

      if (goToLogin) {
        router.push("/login");
      }

      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const orderItems = cart.map((item) => ({
        menuItem: item._id,
        quantity: item.quantity,
      }));

      const response = await fetch(`${API_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: orderItems,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to place order.");
        return;
      }

      clearCart();
      setMessage("Order placed successfully!");

      setTimeout(() => {
        router.push("/orders");
      }, 1500);
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong while placing your order.");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0 && !message) {
    return (
      <div className="min-h-screen bg-[#09090b] px-6 py-16 text-white">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold">
            Your{" "}
            <span className="bg-gradient-to-r from-orange-300 to-amber-200 bg-clip-text text-transparent">
              Cart
            </span>
          </h1>

          <p className="mt-3 text-zinc-400">
            Review your order before checkout.
          </p>

          <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-12 text-center">
            <ShoppingBag
              className="mx-auto mb-4 text-zinc-500"
              size={40}
            />

            <p className="text-zinc-400">
              Your cart is empty.
            </p>

            <Link
              href="/menu"
              className="mt-6 inline-block rounded-xl bg-gradient-to-r from-orange-500 to-amber-400 px-6 py-3 font-semibold text-black transition hover:scale-105"
            >
              Browse Menu
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (message === "Order placed successfully!") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#09090b] px-6 text-white">
        <div className="w-full max-w-md rounded-3xl border border-green-500/20 bg-white/[0.03] p-10 text-center">
          <CheckCircle
            className="mx-auto mb-5 text-green-400"
            size={56}
          />

          <h1 className="text-2xl font-bold">
            Order Placed!
          </h1>

          <p className="mt-3 text-zinc-400">
            Your order has been successfully placed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] px-6 py-16 text-white">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold">
          Your{" "}
          <span className="bg-gradient-to-r from-orange-300 to-amber-200 bg-clip-text text-transparent">
            Cart
          </span>
        </h1>

        <p className="mt-3 text-zinc-400">
          Review your order before checkout.
        </p>

        <div className="mt-10 space-y-4">
          {cart.map((item) => (
            <div
              key={item._id}
              className="flex flex-col gap-5 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <h2 className="text-lg font-semibold">
                  {item.name}
                </h2>

                <p className="mt-1 text-sm text-zinc-400">
                  ${item.price} each
                </p>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center rounded-lg border border-white/10">
                  <button
                    onClick={() =>
                      updateQuantity(item._id, -1)
                    }
                    className="p-2 text-zinc-300 transition hover:text-orange-300"
                  >
                    <Minus size={18} />
                  </button>

                  <span className="min-w-10 text-center font-medium">
                    {item.quantity}
                  </span>

                  <button
                    onClick={() =>
                      updateQuantity(item._id, 1)
                    }
                    className="p-2 text-zinc-300 transition hover:text-orange-300"
                  >
                    <Plus size={18} />
                  </button>
                </div>

                <span className="min-w-16 text-right font-semibold text-orange-300">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>

                <button
                  onClick={() =>
                    removeFromCart(item._id)
                  }
                  className="text-zinc-500 transition hover:text-red-400"
                  aria-label={`Remove ${item.name}`}
                >
                  <Trash2 size={19} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {message && (
          <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {message}
          </div>
        )}

        <div className="mt-8 flex flex-col items-start justify-between gap-6 rounded-2xl border border-orange-400/20 bg-gradient-to-r from-orange-500/10 to-amber-400/5 p-6 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm text-zinc-400">
              Order Total
            </p>

            <p className="mt-1 text-3xl font-bold text-white">
              ${total.toFixed(2)}
            </p>
          </div>

          <button
            onClick={handleCheckout}
            disabled={loading}
            className="rounded-xl bg-gradient-to-r from-orange-500 to-amber-400 px-6 py-3 font-semibold text-black transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "Placing Order..."
              : "Proceed to Checkout"}
          </button>
        </div>
      </div>
    </div>
  );
}