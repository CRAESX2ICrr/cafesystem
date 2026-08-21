"use client";

import { useEffect, useState } from "react";
import {
  X,
  Save,
  Check,
  XCircle,
  Plus,
  Trash2,
} from "lucide-react";

export default function MenuItemForm({
  editingItem,
  ingredients,
  onSubmit,
  onCancel,
}) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const [available, setAvailable] = useState(true);

  const [selectedIngredients, setSelectedIngredients] =
    useState([]);

  const [selectedIngredient, setSelectedIngredient] =
    useState("");

  const [ingredientQuantity, setIngredientQuantity] =
    useState(1);

  useEffect(() => {
    if (editingItem) {
      setName(editingItem.name || "");
      setPrice(editingItem.price || "");
      setCategory(editingItem.category || "");
      setImage(editingItem.image || "");
      setAvailable(editingItem.available ?? true);

      setSelectedIngredients(
        editingItem.ingredients?.map((item) => ({
          ingredient: item.ingredient?._id ||
            item.ingredient,
          quantity: item.quantity,
        })) || []
      );
    } else {
      setName("");
      setPrice("");
      setCategory("");
      setImage("");
      setAvailable(true);

      setSelectedIngredients([]);
    }

    setSelectedIngredient("");
    setIngredientQuantity(1);
  }, [editingItem]);

  const handleAddIngredient = () => {
    if (!selectedIngredient) {
      return;
    }

    const quantity = Number(ingredientQuantity);

    if (quantity < 1) {
      return;
    }

    const alreadyExists =
      selectedIngredients.some(
        (item) =>
          item.ingredient === selectedIngredient
      );

    if (alreadyExists) {
      return;
    }

    setSelectedIngredients((prev) => [
      ...prev,
      {
        ingredient: selectedIngredient,
        quantity,
      },
    ]);

    setSelectedIngredient("");
    setIngredientQuantity(1);
  };

  const handleRemoveIngredient = (id) => {
    setSelectedIngredients((prev) =>
      prev.filter(
        (item) => item.ingredient !== id
      )
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit({
      name,
      price: Number(price),
      category,
      image,
      available,
      ingredients: selectedIngredients,
    });
  };

  return (
    <div className="mb-10 rounded-2xl border border-orange-400/20 bg-white/[0.03] p-6">

      <div className="mb-6 flex items-center justify-between">

        <h2 className="text-xl font-semibold">
          {editingItem
            ? "Edit Menu Item"
            : "Add Menu Item"}
        </h2>

        <button
          type="button"
          onClick={onCancel}
          className="text-zinc-400 transition hover:text-white"
        >
          <X size={22} />
        </button>

      </div>

      <form
        onSubmit={handleSubmit}
        className="grid gap-5 md:grid-cols-2"
      >

        {/* Name */}
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-300">
            Item Name
          </label>

          <input
            type="text"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            placeholder="e.g. Cappuccino"
            required
            className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-orange-400"
          />
        </div>

        {/* Price */}
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-300">
            Price
          </label>

          <input
            type="number"
            step="0.01"
            min="0"
            value={price}
            onChange={(e) =>
              setPrice(e.target.value)
            }
            placeholder="4.99"
            required
            className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-orange-400"
          />
        </div>

        {/* Category */}
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-300">
            Category
          </label>

          <input
            type="text"
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
            placeholder="e.g. Coffee"
            required
            className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-orange-400"
          />
        </div>

        {/* Availability */}
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-300">
            Availability
          </label>

          <button
            type="button"
            onClick={() =>
              setAvailable(!available)
            }
            className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 font-medium transition ${
              available
                ? "border-green-500/30 bg-green-500/10 text-green-300"
                : "border-red-500/30 bg-red-500/10 text-red-300"
            }`}
          >
            <span>
              {available
                ? "Available"
                : "Unavailable"}
            </span>

            {available ? (
              <Check size={18} />
            ) : (
              <XCircle size={18} />
            )}
          </button>
        </div>

        {/* Image URL */}
        <div className="md:col-span-2">

          <label className="mb-2 block text-sm font-medium text-zinc-300">
            Image URL
          </label>

          <input
            type="url"
            value={image}
            onChange={(e) =>
              setImage(e.target.value)
            }
            placeholder="Paste image URL here"
            className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-orange-400"
          />

          {image && (
            <div className="mt-3 w-48 overflow-hidden rounded-xl border border-white/10">

              <img
                src={image}
                alt="Preview"
                className="aspect-square w-full object-cover"
              />

            </div>
          )}

        </div>

        {/* Ingredients */}
        <div className="md:col-span-2">

          <label className="mb-3 block text-sm font-medium text-zinc-300">
            Ingredients Required
          </label>

          <div className="flex flex-col gap-3 md:flex-row">

            <select
              value={selectedIngredient}
              onChange={(e) =>
                setSelectedIngredient(
                  e.target.value
                )
              }
              className="flex-1 rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-orange-400"
            >

              <option value="">
                Select an ingredient
              </option>

              {ingredients.map((ingredient) => (
                <option
                  key={ingredient._id}
                  value={ingredient._id}
                >
                  {ingredient.name}
                </option>
              ))}

            </select>

            <input
              type="number"
              min="1"
              step="1"
              value={ingredientQuantity}
              onChange={(e) =>
                setIngredientQuantity(
                  e.target.value
                )
              }
              className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-orange-400 md:w-32"
            />

            <button
              type="button"
              onClick={handleAddIngredient}
              className="flex items-center justify-center gap-2 rounded-xl border border-orange-400/30 bg-orange-400/10 px-5 py-3 font-medium text-orange-300 transition hover:bg-orange-400/20"
            >
              <Plus size={18} />
              Add
            </button>

          </div>

          {/* Selected Ingredients */}
          {selectedIngredients.length > 0 && (

            <div className="mt-4 space-y-3">

              {selectedIngredients.map((item) => {
                const ingredient =
                  ingredients.find(
                    (ingredient) =>
                      ingredient._id ===
                      item.ingredient
                  );

                return (
                  <div
                    key={item.ingredient}
                    className="flex items-center justify-between rounded-xl border border-white/10 bg-black/20 px-4 py-3"
                  >

                    <div>

                      <p className="font-medium">
                        {ingredient?.name ||
                          "Unknown Ingredient"}
                      </p>

                      <p className="text-sm text-zinc-400">
                        Quantity required:{" "}
                        {item.quantity}
                      </p>

                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        handleRemoveIngredient(
                          item.ingredient
                        )
                      }
                      className="text-red-300 transition hover:text-red-200"
                    >
                      <Trash2 size={18} />
                    </button>

                  </div>
                );
              })}

            </div>

          )}

        </div>

        {/* Buttons */}
        <div className="flex gap-3 md:col-span-2">

          <button
            type="submit"
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-400 px-5 py-3 font-semibold text-black transition hover:scale-105"
          >
            <Save size={18} />

            {editingItem
              ? "Save Changes"
              : "Add Item"}
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-white/10 px-5 py-3 font-medium text-zinc-300 transition hover:bg-white/5"
          >
            Cancel
          </button>

        </div>

      </form>
    </div>
  );
}