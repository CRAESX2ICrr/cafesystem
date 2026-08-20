"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  UtensilsCrossed,
  Save,
  Check,
  XCircle,
} from "lucide-react";

import API_URL from "../../../services/api";

export default function AdminMenuPage() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const [available, setAvailable] = useState(true);

  const getToken = () => {
    return localStorage.getItem("token");
  };

  const fetchMenu = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/api/menu`);
      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Could not load menu items.");
        return;
      }

      setMenuItems(data);
    } catch (error) {
      console.error(error);
      setMessage("Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

const resetForm = () => {
  setName("");
  setPrice("");
  setCategory("");
  setImage("");
  setAvailable(true);
  setEditingItem(null);
  setShowForm(false);
};

const openAddForm = () => {
  setName("");
  setPrice("");
  setCategory("");
  setImage("");
  setAvailable(true);
  setEditingItem(null);
  setShowForm(true);
  setMessage("");
};

const openEditForm = (item) => {
  setEditingItem(item);
  setName(item.name || "");
  setPrice(item.price || "");
  setCategory(item.category || "");
  setImage(item.image || "");
  setAvailable(item.available ?? true);
  setShowForm(true);
  setMessage("");
};

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");

    const token = getToken();

    if (!token) {
      setMessage("You must be logged in as an admin.");
      return;
    }

    try {
      const url = editingItem
        ? `${API_URL}/api/menu/${editingItem._id}`
        : `${API_URL}/api/menu`;

      const method = editingItem ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
        name,
        category,
        price: Number(price),
        image,
        available,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Could not save menu item.");
        return;
      }

      resetForm();
      await fetchMenu();
    } catch (error) {
      console.error(error);
      setMessage("Could not save menu item.");
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this menu item?"
    );

    if (!confirmed) return;

    const token = getToken();

    if (!token) {
      setMessage("You must be logged in as an admin.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/menu/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Could not delete menu item.");
        return;
      }

      await fetchMenu();
    } catch (error) {
      console.error(error);
      setMessage("Could not delete menu item.");
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] px-6 py-12 text-white">
      <div className="mx-auto max-w-7xl">
        {/* Page Header */}
        <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-orange-300">
              Admin
            </p>

            <h1 className="text-4xl font-bold sm:text-5xl">
              Manage{" "}
              <span className="bg-gradient-to-r from-orange-300 via-amber-300 to-yellow-200 bg-clip-text text-transparent">
                Menu
              </span>
            </h1>

            <p className="mt-4 text-zinc-400">
              Add, edit, remove, and manage the availability of menu items.
            </p>
          </div>

          <button
            onClick={openAddForm}
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-400 px-5 py-3 font-semibold text-black transition hover:scale-105"
          >
            <Plus size={18} />
            Add Menu Item
          </button>
        </div>

        {/* Message */}
        {message && (
          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {message}
          </div>
        )}

        {/* Add / Edit Form */}
        {showForm && (
          <div className="mb-10 rounded-2xl border border-orange-400/20 bg-white/[0.03] p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                {editingItem ? "Edit Menu Item" : "Add Menu Item"}
              </h2>

              <button
                onClick={resetForm}
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
                  onChange={(e) => setName(e.target.value)}
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
                  onChange={(e) => setPrice(e.target.value)}
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
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. Coffee"
                  required
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-orange-400"
                />
              </div>

            {/* Image URL */}
            <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-zinc-300">
                Image URL
            </label>

            <input
                type="url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="Paste image URL here"
                className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-orange-400"
            />

            {image && (
                <div className="mt-3 overflow-hidden rounded-xl border border-white/10">
                <img
                    src={image}
                    alt="Preview"
                    className="h-48 w-full object-cover"
                />
                </div>
            )}
            </div>

            
              {/* Availability */}
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-300">
                  Availability
                </label>

                <button
                  type="button"
                  onClick={() => setAvailable(!available)}
                  className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 font-medium transition ${
                    available
                      ? "border-green-500/30 bg-green-500/10 text-green-300"
                      : "border-red-500/30 bg-red-500/10 text-red-300"
                  }`}
                >
                  <span>
                    {available ? "Available" : "Unavailable"}
                  </span>

                  {available ? (
                    <Check size={18} />
                  ) : (
                    <XCircle size={18} />
                  )}
                </button>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 md:col-span-2">
                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-400 px-5 py-3 font-semibold text-black transition hover:scale-105"
                >
                  <Save size={18} />

                  {editingItem ? "Save Changes" : "Add Item"}
                </button>

                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-xl border border-white/10 px-5 py-3 font-medium text-zinc-300 transition hover:bg-white/5"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Menu Items */}
        {loading ? (
          <p className="text-center text-zinc-400">
            Loading menu...
          </p>
        ) : menuItems.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-12 text-center">
            <UtensilsCrossed
              size={40}
              className="mx-auto text-orange-300"
            />

            <p className="mt-4 text-zinc-400">
              No menu items found.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {menuItems.map((item) => (
              <div
                key={item._id}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
              >
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

                {/* Actions */}
                <div className="mt-6 flex justify-end gap-2 border-t border-white/10 pt-4">
                  <button
                    onClick={() => openEditForm(item)}
                    className="flex h-10 items-center gap-2 rounded-lg border border-white/10 px-3 text-sm text-zinc-300 transition hover:border-orange-400/40 hover:text-orange-300"
                  >
                    <Pencil size={16} />
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(item._id)}
                    className="flex h-10 items-center gap-2 rounded-lg border border-white/10 px-3 text-sm text-zinc-300 transition hover:border-red-400/40 hover:text-red-400"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}