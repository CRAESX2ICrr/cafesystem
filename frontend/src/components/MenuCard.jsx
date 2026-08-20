"use client";

import { ShoppingCart } from "lucide-react";

export default function MenuCard({ item, addToCart }) {
  return (
    <div className="group overflow-hidden rounded-3xl border border-white/10 bg-[#18120d]/90 shadow-xl shadow-black/20 backdrop-blur-md transition duration-300 hover:-translate-y-2 hover:border-orange-400/40 hover:shadow-2xl hover:shadow-orange-500/10">
      
      <div className="relative h-56 overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#18120d] via-black/10 to-transparent" />

        <div className="absolute right-4 top-4 rounded-full border border-white/10 bg-black/50 px-4 py-2 text-sm font-bold text-orange-300 backdrop-blur-md">
          ${Number(item.price).toFixed(2)}
        </div>

        <div className="absolute bottom-4 left-4 rounded-full border border-white/10 bg-black/40 px-3 py-1 text-xs font-medium text-zinc-200 backdrop-blur-md">
          {item.category || "Menu Item"}
        </div>
      </div>

      <div className="p-6">
        <h2 className="text-2xl font-semibold text-white">
          {item.name}
        </h2>

        <p className="mt-3 min-h-[48px] text-sm leading-6 text-zinc-300">
          {item.description || "Freshly prepared and ready for you to enjoy."}
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
  );
}