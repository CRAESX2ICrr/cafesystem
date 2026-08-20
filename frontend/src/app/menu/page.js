"use client";

import { useEffect, useState } from "react";
import { ShoppingCart, Coffee, UtensilsCrossed } from "lucide-react";
import API_URL from "../../services/api";
import { useCart } from "../../context/CartContext";

const menuImages = {
  Cappuccino:
    "https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=900&q=80",

  Americano:
    "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80",

  "Chicken Sandwich":
    "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=900&q=80",

  Latte:
    "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?auto=format&fit=crop&w=900&q=80",

  Espresso:
    "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=900&q=80",

  "Iced Coffee":
    "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=900&q=80",

  Burger:
    "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80",

  "French Fries":
    "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=900&q=80",

  Cake:
    "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=80",

  default:
    "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=80",
};

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const { addToCart } = useCart();

  useEffect(() => {
    fetch(`${API_URL}/api/menu`)
      .then((response) => response.json())
      .then((data) => {
        setMenuItems(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, []);

const getImage = (item) => {
  return item.image || menuImages[item.name] || menuImages.default;
};

  return (
    <div className="relative min-h-screen px-6 py-16 text-white">
      <div className="mx-auto max-w-7xl">

        {/* Heading */}
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

        {/* Loading */}
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
              <div
                key={item._id}
                className="group overflow-hidden rounded-3xl border border-white/10 bg-[#18120d]/90 shadow-xl shadow-black/20 backdrop-blur-md transition duration-300 hover:-translate-y-2 hover:border-orange-400/40 hover:shadow-2xl hover:shadow-orange-500/10"
              >

                {/* Image */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={getImage(item)}
                    alt={item.name}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#18120d] via-black/10 to-transparent" />

                  {/* Price */}
                  <div className="absolute right-4 top-4 rounded-full border border-white/10 bg-black/50 px-4 py-2 text-sm font-bold text-orange-300 backdrop-blur-md">
                    ${Number(item.price).toFixed(2)}
                  </div>

                  {/* Category */}
                  <div className="absolute bottom-4 left-4 rounded-full border border-white/10 bg-black/40 px-3 py-1 text-xs font-medium text-zinc-200 backdrop-blur-md">
                    {item.category || "Menu Item"}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h2 className="text-2xl font-semibold text-white">
                    {item.name}
                  </h2>

                  <p className="mt-3 min-h-[48px] text-sm leading-6 text-zinc-300">
                    {item.description ||
                      "Freshly prepared and ready for you to enjoy."}
                  </p>

                  <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-5">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-zinc-400">
                        Price
                      </p>

                      <p className="mt-1 text-xl font-bold text-orange-300">
                        ${Number(item.price).toFixed(2)}
                      </p>
                    </div>

                    <button
                      onClick={() => addToCart(item)}
                      disabled={!item.available}
                      className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-400 px-5 py-3 text-sm font-semibold text-black shadow-lg shadow-orange-500/20 transition hover:scale-105 hover:shadow-orange-500/40 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <ShoppingCart size={17} />
                      {item.available ? "Add to Cart" : "Unavailable"}
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