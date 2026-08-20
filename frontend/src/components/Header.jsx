"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingCart,
  User,
  LogOut,
  ClipboardList,
  LayoutDashboard,
  CookingPot,
} from "lucide-react";
import { useCart } from "../context/CartContext";

export default function Header() {
  const router = useRouter();
  const { cart } = useCart();

  const [user, setUser] = useState(null);

  const updateUser = () => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Could not read user data", error);
        localStorage.removeItem("user");
        setUser(null);
      }
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    updateUser();

    window.addEventListener("authChanged", updateUser);

    return () => {
      window.removeEventListener("authChanged", updateUser);
    };
  }, []);

  const totalItems = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.dispatchEvent(new Event("authChanged"));

    router.push("/");
  };

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

          {/* Only customers need a cart */}
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

          {user && (
            <>
              <div className="flex items-center gap-2 text-sm text-zinc-300">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-amber-300 text-sm font-bold text-black">
                  <User size={16} />
                </div>

                <span className="hidden md:inline">
                  {user.name}
                </span>
              </div>

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