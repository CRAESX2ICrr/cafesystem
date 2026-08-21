"use client";

import { useEffect, useState } from "react";

export default function IngredientForm({
  editingIngredient,
  suppliers,
  onSubmit,
  onCancel,
}) {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [lowStockThreshold, setLowStockThreshold] =
    useState("");
  const [supplier, setSupplier] = useState("");

  useEffect(() => {
    if (editingIngredient) {
      setName(editingIngredient.name || "");
      setQuantity(editingIngredient.quantity ?? "");
      setLowStockThreshold(
        editingIngredient.lowStockThreshold ?? ""
      );

      setSupplier(
        editingIngredient.supplier?._id ||
          editingIngredient.supplier ||
          ""
      );
    } else {
      setName("");
      setQuantity("");
      setLowStockThreshold("");
      setSupplier("");
    }
  }, [editingIngredient]);

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit({
      name,
      quantity: Number(quantity),
      lowStockThreshold: Number(lowStockThreshold),
      supplier: supplier || null,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6"
    >
      <div className="mb-6">
        <h2 className="text-xl font-semibold">
          {editingIngredient
            ? "Edit Ingredient"
            : "Add Ingredient"}
        </h2>

        <p className="mt-1 text-sm text-zinc-400">
          {editingIngredient
            ? "Update the ingredient details and stock information."
            : "Add a new ingredient to your inventory."}
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">

        {/* Ingredient Name */}
        <div>
          <label className="mb-2 block text-sm text-zinc-300">
            Ingredient Name
          </label>

          <input
            type="text"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            placeholder="e.g. Milk"
            required
            className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition focus:border-orange-400"
          />
        </div>

        {/* Quantity */}
        <div>
          <label className="mb-2 block text-sm text-zinc-300">
            Current Stock
          </label>

          <input
            type="number"
            min="0"
            value={quantity}
            onChange={(e) =>
              setQuantity(e.target.value)
            }
            placeholder="0"
            required
            className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition focus:border-orange-400"
          />
        </div>

        {/* Low Stock Threshold */}
        <div>
          <label className="mb-2 block text-sm text-zinc-300">
            Low Stock Threshold
          </label>

          <input
            type="number"
            min="0"
            value={lowStockThreshold}
            onChange={(e) =>
              setLowStockThreshold(e.target.value)
            }
            placeholder="5"
            required
            className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition focus:border-orange-400"
          />
        </div>

        {/* Supplier */}
        <div>
          <label className="mb-2 block text-sm text-zinc-300">
            Supplier
          </label>

          <select
            value={supplier}
            onChange={(e) =>
              setSupplier(e.target.value)
            }
            className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition focus:border-orange-400"
          >
            <option value="">
              No supplier selected
            </option>

            {suppliers.map((supplierItem) => (
              <option
                key={supplierItem._id}
                value={supplierItem._id}
              >
                {supplierItem.name}
              </option>
            ))}
          </select>
        </div>

      </div>

      {/* Buttons */}
      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-zinc-300 transition hover:bg-white/5"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="rounded-xl bg-gradient-to-r from-orange-500 to-amber-400 px-5 py-3 text-sm font-semibold text-black transition hover:scale-105"
        >
          {editingIngredient
            ? "Save Changes"
            : "Add Ingredient"}
        </button>
      </div>
    </form>
  );
}