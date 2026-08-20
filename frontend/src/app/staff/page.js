"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ClipboardList,
  Clock,
  ChefHat,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import API_URL from "../../services/api";

export default function StaffPage() {
  const router = useRouter();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [message, setMessage] = useState("");

  const getOrders = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const response = await fetch(`${API_URL}/api/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Could not load orders.");
        return;
      }

      setOrders(data);
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong while loading orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (!savedUser) {
      router.push("/login");
      return;
    }

    try {
      const user = JSON.parse(savedUser);

      if (user.role !== "staff") {
        router.push("/");
        return;
      }

      getOrders();
    } catch (error) {
      console.error(error);
      router.push("/login");
    }
  }, []);

  const updateStatus = async (orderId, status) => {
    const token = localStorage.getItem("token");

    try {
      setUpdatingId(orderId);
      setMessage("");

      const response = await fetch(
        `${API_URL}/api/orders/${orderId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Could not update order.");
        return;
      }

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order._id === orderId
            ? { ...order, status: data.status }
            : order
        )
      );
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong while updating the order.");
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Ready":
        return "border-green-500/30 bg-green-500/10 text-green-300";

      case "In-Progress":
        return "border-blue-500/30 bg-blue-500/10 text-blue-300";

      default:
        return "border-orange-500/30 bg-orange-500/10 text-orange-300";
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] px-6 py-12 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-orange-300">
              Staff Portal
            </p>

            <h1 className="text-4xl font-bold sm:text-5xl">
              Manage{" "}
              <span className="bg-gradient-to-r from-orange-300 to-amber-200 bg-clip-text text-transparent">
                Orders
              </span>
            </h1>

            <p className="mt-4 text-zinc-400">
              Review incoming orders and update their preparation status.
            </p>
          </div>

          <button
            onClick={getOrders}
            className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-medium text-zinc-300 transition hover:border-orange-400/30 hover:text-orange-300"
          >
            <RefreshCw size={17} />
            Refresh
          </button>
        </div>

        {message && (
          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {message}
          </div>
        )}

        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center text-zinc-400">
            Loading orders...
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] px-6 py-20 text-center">
            <ClipboardList
              size={42}
              className="mx-auto mb-4 text-zinc-600"
            />

            <h2 className="text-xl font-semibold">
              No orders yet
            </h2>

            <p className="mt-2 text-zinc-400">
              New customer orders will appear here.
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="rounded-3xl border border-white/10 bg-white/[0.03] p-6"
              >
                <div className="flex flex-col justify-between gap-5 border-b border-white/10 pb-5 sm:flex-row sm:items-start">
                  <div>
                    <p className="text-sm text-zinc-500">
                      Order
                    </p>

                    <h2 className="mt-1 font-mono text-lg font-semibold text-orange-300">
                      #{order._id.slice(-8)}
                    </h2>

                    {order.customer && (
                      <div className="mt-4">
                        <p className="text-sm font-medium text-white">
                          {order.customer.name}
                        </p>

                        <p className="mt-1 text-sm text-zinc-500">
                          {order.customer.email}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-start gap-3 sm:items-end">
                    <p className="text-sm text-zinc-500">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>

                    <span
                      className={`rounded-full border px-3 py-1 text-sm font-medium ${getStatusStyle(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>

                <div className="space-y-4 py-5">
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between gap-4"
                    >
                      <div>
                        <p className="font-medium text-white">
                          {item.menuItem?.name || "Menu item"}
                        </p>

                        <p className="mt-1 text-sm text-zinc-500">
                          Quantity: {item.quantity}
                        </p>
                      </div>

                      <p className="font-semibold text-orange-300">
                        $
                        {(
                          item.menuItem?.price * item.quantity || 0
                        ).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col justify-between gap-5 border-t border-white/10 pt-5 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-zinc-500">
                      Update status:
                    </span>

                    {order.status === "Pending" && (
                      <Clock size={17} className="text-orange-300" />
                    )}

                    {order.status === "In-Progress" && (
                      <ChefHat size={17} className="text-blue-300" />
                    )}

                    {order.status === "Ready" && (
                      <CheckCircle2
                        size={17}
                        className="text-green-300"
                      />
                    )}
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() =>
                        updateStatus(order._id, "Pending")
                      }
                      disabled={
                        updatingId === order._id ||
                        order.status === "Pending"
                      }
                      className="rounded-lg border border-orange-500/30 px-4 py-2 text-sm font-medium text-orange-300 transition hover:bg-orange-500/10 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Pending
                    </button>

                    <button
                      onClick={() =>
                        updateStatus(order._id, "In-Progress")
                      }
                      disabled={
                        updatingId === order._id ||
                        order.status === "In-Progress"
                      }
                      className="rounded-lg border border-blue-500/30 px-4 py-2 text-sm font-medium text-blue-300 transition hover:bg-blue-500/10 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      In Progress
                    </button>

                    <button
                      onClick={() =>
                        updateStatus(order._id, "Ready")
                      }
                      disabled={
                        updatingId === order._id ||
                        order.status === "Ready"
                      }
                      className="rounded-lg bg-gradient-to-r from-green-400 to-emerald-300 px-4 py-2 text-sm font-semibold text-black transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Ready
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}