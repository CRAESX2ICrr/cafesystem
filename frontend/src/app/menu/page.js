"use client";

import { useEffect, useState } from "react";
import { Coffee, UtensilsCrossed } from "lucide-react";

import API_URL from "../../services/api";
import { useCart } from "../../context/CartContext";
import MenuCard from "../../components/MenuCard";

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    fetch(`${API_URL}/api/menu`)
      .then((response) => response.json())
      .then(setMenuItems)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="relative min-h-screen px-6 py-16 text-white">
      <div className="mx-auto max-w-7xl">

        <div className="mb-16 text-center">
          <div className="mb-5 flex justify-center">
            <div className="flex items-center gap-2 rounded-full border border-orange-400/20 bg-orange-400/10 px-4 py-2 text-sm text-orange-300">
              <Coffee size={16} />
              Freshly made for you
            </div>
          </div>

          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
            Explore Our{" "}
            <span className="bg-gradient-to-r from-orange-300 via-amber-300 to-yellow-200 bg-clip-text text-transparent">
              Menu
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-zinc-300 sm:text-lg">
            Coffee, food, and everything you need for your perfect café break.
          </p>
        </div>

        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <div className="text-center">
              <Coffee
                size={40}
                className="mx-auto mb-4 animate-pulse text-orange-400"
              />

              <p className="text-zinc-300">
                Brewing your menu...
              </p>
            </div>
          </div>
        ) : menuItems.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-black/50 py-20 text-center backdrop-blur-md">
            <UtensilsCrossed
              size={40}
              className="mx-auto mb-4 text-zinc-400"
            />

            <p className="text-zinc-300">
              No menu items available yet.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {menuItems.map((item) => (
              <MenuCard
                key={item._id}
                item={item}
                addToCart={addToCart}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}