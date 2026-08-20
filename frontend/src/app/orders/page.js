"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ClipboardList,
  ShoppingBag,
  Clock,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import API_URL from "../../services/api";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setMessage("Please log in to view your orders.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${API_URL}/api/orders/my-orders`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          setMessage(data.message || "Failed to load orders.");
          setLoading(false);
          return;
        }

        setOrders(data);
      } catch (error) {
        console.error(error);
        setMessage("Something went wrong while loading your orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case "Ready":
        return "border-green-500/20 bg-green-500/10 text-green-300";

      case "In-Progress":
        return "border-blue-500/20 bg-blue-500/10 text-blue-300";

      default:
        return "border-orange-500/20 bg-orange-500/10 text-orange-300";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Ready":
        return <CheckCircle2 size={16} />;

      case "In-Progress":
        return <Loader2 size={16} />;

      default:
        return <Clock size={16} />;
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#09090b] text-white">
        <div className="text-center">
          <Loader2
            size={36}
            className="mx-auto animate-spin text-orange-300"
          />

          <p className="mt-4 text-zinc-400">
            Loading your orders...
          </p>
        </div>
      </div>
    );
  }

  if (message) {
    return (
      <div className="min-h-screen bg-[#09090b] px-6 py-16 text-white">
        <div className="mx-auto max-w-3xl rounded-2xl border border-red-500/20 bg-red-500/10 p-8 text-center">
          <ClipboardList
            size={40}
            className="mx-auto text-red-300"
          />

          <p className="mt-4 text-red-200">
            {message}
          </p>

          <Link
            href="/login"
            className="mt-6 inline-block rounded-xl bg-gradient-to-r from-orange-500 to-amber-400 px-6 py-3 font-semibold text-black"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] px-6 py-16 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-300">
            Order History
          </p>

          <h1 className="mt-3 text-4xl font-bold sm:text-5xl">
            My{" "}
            <span className="bg-gradient-to-r from-orange-300 via-amber-300 to-yellow-200 bg-clip-text text-transparent">
              Orders
            </span>
          </h1>

          <p className="mt-4 text-zinc-400">
            Track your recent CafeMS orders.
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] px-6 py-16 text-center">
            <ShoppingBag
              size={48}
              className="mx-auto text-zinc-600"
            />

            <h2 className="mt-5 text-xl font-semibold">
              No orders yet
            </h2>

            <p className="mt-2 text-zinc-400">
              Your completed orders will appear here.
            </p>

            <Link
              href="/menu"
              className="mt-6 inline-block rounded-xl bg-gradient-to-r from-orange-500 to-amber-400 px-6 py-3 font-semibold text-black transition hover:scale-105"
            >
              Browse Menu
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map((order) => (
              <div
                key={order._id}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
              >
                <div className="flex flex-col justify-between gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-center">
                  <div>
                    <p className="text-sm text-zinc-500">
                      Order
                    </p>

                    <p className="mt-1 font-mono text-sm text-zinc-300">
                      #{order._id.slice(-8)}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
                    <p className="text-sm text-zinc-500">
                      {new Date(order.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }
                      )}
                    </p>

                    <div
                      className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium ${getStatusStyle(
                        order.status
                      )}`}
                    >
                      {getStatusIcon(order.status)}
                      {order.status}
                    </div>
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  {order.items.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium text-white">
                          {item.menuItem?.name ||
                            "Menu item unavailable"}
                        </p>

                        <p className="mt-1 text-sm text-zinc-500">
                          Quantity: {item.quantity}
                        </p>
                      </div>

                      <p className="font-semibold text-orange-300">
                        $
                        {(
                          (item.menuItem?.price || 0) *
                          item.quantity
                        ).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-5 flex justify-between border-t border-white/10 pt-5">
                  <span className="text-zinc-400">
                    Order Total
                  </span>

                  <span className="text-lg font-bold text-white">
                    $
                    {order.items
                      .reduce(
                        (total, item) =>
                          total +
                          (item.menuItem?.price || 0) *
                            item.quantity,
                        0
                      )
                      .toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}