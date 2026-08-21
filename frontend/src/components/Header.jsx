"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

import { ShoppingCart,User,LogOut,ClipboardList,LayoutDashboard,CookingPot,Bell,} from "lucide-react";

import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const router = useRouter();
  const { cart } = useCart();
  const { user, logout, isLoaded } = useAuth();

const [showNotifications, setShowNotifications] = useState(false);
const [notifications, setNotifications] = useState([]);
const [loadingNotifications, setLoadingNotifications] = useState(false);

  

  const totalItems = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const handleLogout = () => {
    logout();
    router.push("/");
  };


useEffect(() => {
  const fetchNotifications = async () => {
    if (!user || (user.role !== "staff" && user.role !== "admin")) return;

    try {
      setLoadingNotifications(true);

      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/notifications",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setNotifications(data);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoadingNotifications(false);
    }
  };

  fetchNotifications();
}, [user]);


const unreadNotifications = notifications.filter(
  (notification) => !notification.isRead
).length;



useEffect(() => {
  if (!user || (user.role !== "staff" && user.role !== "admin")) {
  return;
  }

  const socket = io("http://localhost:5000");

  socket.on("connect", () => {
    console.log("Connected to Socket.IO:", socket.id);
  });

  // New low-stock notification
  socket.on("lowStockNotification", (notification) => {
    console.log("New low stock notification:", notification);

    setNotifications((currentNotifications) => [
      notification,
      ...currentNotifications,
    ]);
  });

  // Remove notification when admin restocks ingredient
  socket.on("lowStockResolved", ({ ingredientId }) => {
    console.log("Low stock resolved:", ingredientId);

    setNotifications((currentNotifications) =>
      currentNotifications.filter((notification) => {
        const notificationIngredientId =
          notification.ingredient?._id ||
          notification.ingredient;

        return notificationIngredientId !== ingredientId;
      })
    );
  });

  // Receive live inventory updates
  socket.on("inventoryUpdated", (ingredient) => {
    console.log("Inventory updated:", ingredient);
  });

  return () => {
    socket.disconnect();
  };
}, [user]);

  if (!isLoaded) {
    return null;
  }


  return (
    <header className="border-b border-white/10 bg-gradient-to-r from-[#09090b] via-[#18120d] to-[#09090b] px-6 py-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between">

        <Link
          href="/"
          className="text-xl font-semibold tracking-tight text-white"
        >
          Cafe<span className="text-orange-300">MS</span>
        </Link>

        <nav className="flex items-center gap-6">

          <Link
            href="/"
            className="text-sm font-medium text-zinc-300 transition hover:text-orange-300"
          >
            Home
          </Link>

          <Link
            href="/menu"
            className="text-sm font-medium text-zinc-300 transition hover:text-orange-300"
          >
            Menu
          </Link>

          {/* CUSTOMER ORDERS */}
          {user && user.role === "customer" && (
            <Link
              href="/orders"
              className="flex items-center gap-2 text-sm font-medium text-zinc-300 transition hover:text-orange-300"
            >
              <ClipboardList size={18} />
              Orders
            </Link>
          )}

          {/* STAFF ORDER MANAGEMENT */}
          {user && user.role === "staff" && (
            <Link
              href="/staff"
              className="flex items-center gap-2 text-sm font-medium text-zinc-300 transition hover:text-orange-300"
            >
              <CookingPot size={18} />
              Manage Orders
            </Link>
          )}

          {/* ADMIN DASHBOARD */}
          {user && user.role === "admin" && (
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-sm font-medium text-zinc-300 transition hover:text-orange-300"
            >
              <LayoutDashboard size={18} />
              Dashboard
            </Link>
          )}

          {/* CUSTOMER CART */}
          {(!user || user.role === "customer") && (
            <Link
              href="/cart"
              className="relative flex items-center gap-2 text-sm font-medium text-zinc-300 transition hover:text-orange-300"
            >
              <ShoppingCart size={20} />

              {totalItems > 0 && (
                <span className="absolute -right-3 -top-3 flex h-5 w-5 items-center justify-center rounded-full bg-orange-400 text-xs font-bold text-black">
                  {totalItems}
                </span>
              )}
            </Link>
          )}

          {/* LOGIN / REGISTER */}
          {!user && (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-zinc-300 transition hover:text-orange-300"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="rounded-lg bg-gradient-to-r from-orange-500 to-amber-400 px-4 py-2 text-sm font-semibold text-black transition hover:scale-105"
              >
                Register
              </Link>
            </>
          )}

          {/* LOGGED-IN USER */}
          {user && (
            <>
{/* STAFF/Admin NOTIFICATIONS */}
{(user.role === "staff" || user.role === "admin") && (
  <div className="relative">
    <button
      onClick={() =>
        setShowNotifications(!showNotifications)
      }
      className="relative text-zinc-300 transition hover:text-orange-300"
    >
      <Bell size={20} />

      {/* Unread notification badge */}
      {unreadNotifications > 0 && (
        <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
          {unreadNotifications}
        </span>
      )}
    </button>

    {showNotifications && (
      <div className="absolute right-0 top-10 z-50 w-80 rounded-lg border border-white/10 bg-zinc-900 p-4 shadow-xl">
        <h3 className="mb-3 font-semibold text-white">
          Notifications
        </h3>

        {loadingNotifications ? (
          <p className="text-sm text-zinc-400">
            Loading...
          </p>
        ) : notifications.length === 0 ? (
          <p className="text-sm text-zinc-400">
            No new notifications.
          </p>
        ) : (
          <div className="space-y-2">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                className={`rounded-lg border p-3 text-sm ${
                  notification.isRead
                    ? "border-white/10 bg-zinc-800 text-zinc-400"
                    : "border-orange-500/30 bg-orange-500/10 text-orange-200"
                }`}
              >
                <p>{notification.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    )}
  </div>
)}

              {/* USER PROFILE */}
              <div className="flex items-center gap-2 text-sm text-zinc-300">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-amber-300 text-sm font-bold text-black">
                  <User size={16} />
                </div>

                <span className="hidden md:inline">
                  {user.name}
                </span>
              </div>

              {/* LOGOUT */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm font-medium text-zinc-300 transition hover:text-red-400"
              >
                <LogOut size={18} />

                <span className="hidden md:inline">
                  Logout
                </span>
              </button>
            </>
          )}

        </nav>
      </div>
    </header>
  );
}