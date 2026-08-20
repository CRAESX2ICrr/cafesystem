"use client";

import { Pencil, Trash2 } from "lucide-react";

export default function MenuItemCard({
  item,
  onEdit,
  onDelete,
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white">
            {item.name}
          </h2>

          <div className="mt-3 flex items-center gap-2">
            <span className="rounded-full bg-orange-400/10 px-3 py-1 text-xs font-medium text-orange-300">
              {item.category}
            </span>

            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                item.available
                  ? "bg-green-500/10 text-green-300"
                  : "bg-red-500/10 text-red-300"
              }`}
            >
              {item.available
                ? "Available"
                : "Unavailable"}
            </span>
          </div>
        </div>

        <span className="whitespace-nowrap text-lg font-bold text-orange-300">
          ${Number(item.price).toFixed(2)}
        </span>
      </div>

      <div className="mt-6 flex justify-end gap-2 border-t border-white/10 pt-4">
        <button
          onClick={() => onEdit(item)}
          className="flex h-10 items-center gap-2 rounded-lg border border-white/10 px-3 text-sm text-zinc-300 transition hover:border-orange-400/40 hover:text-orange-300"
        >
          <Pencil size={16} />
          Edit
        </button>

        <button
          onClick={() => onDelete(item._id)}
          className="flex h-10 items-center gap-2 rounded-lg border border-white/10 px-3 text-sm text-zinc-300 transition hover:border-red-400/40 hover:text-red-400"
        >
          <Trash2 size={16} />
          Delete
        </button>
      </div>
    </div>
  );
}