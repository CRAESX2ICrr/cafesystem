"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  UtensilsCrossed,
} from "lucide-react";

import API_URL from "../../../services/api";

import MenuItemCard from "../../../components/admin/MenuItemCard";
import MenuItemForm from "../../../components/admin/MenuItemForm";

export default function AdminMenuPage() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const getToken = () => {
    return localStorage.getItem("token");
  };

  const fetchMenu = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/menu`
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message ||
            "Could not load menu items."
        );
        return;
      }

      setMenuItems(data);
    } catch (error) {
      console.error(error);

      setMessage(
        "Could not connect to the server."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const resetForm = () => {
    setEditingItem(null);
    setShowForm(false);
  };

  const openAddForm = () => {
    setEditingItem(null);
    setShowForm(true);
    setMessage("");
  };

  const openEditForm = (item) => {
    setEditingItem(item);
    setShowForm(true);
    setMessage("");
  };

  const handleSubmit = async (formData) => {
    setMessage("");

    const token = getToken();

    if (!token) {
      setMessage(
        "You must be logged in as an admin."
      );
      return;
    }

    try {
      const url = editingItem
        ? `${API_URL}/api/menu/${editingItem._id}`
        : `${API_URL}/api/menu`;

      const method = editingItem
        ? "PUT"
        : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type":
            "application/json",
          Authorization:
            `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message ||
            "Could not save menu item."
        );
        return;
      }

      resetForm();

      await fetchMenu();
    } catch (error) {
      console.error(error);

      setMessage(
        "Could not save menu item."
      );
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this menu item?"
    );

    if (!confirmed) return;

    const token = getToken();

    if (!token) {
      setMessage(
        "You must be logged in as an admin."
      );
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/menu/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message ||
            "Could not delete menu item."
        );
        return;
      }

      await fetchMenu();
    } catch (error) {
      console.error(error);

      setMessage(
        "Could not delete menu item."
      );
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
              Add, edit, remove, and manage
              the availability of menu items.
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
          <MenuItemForm
            editingItem={editingItem}
            onSubmit={handleSubmit}
            onCancel={resetForm}
          />
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
              <MenuItemCard
                key={item._id}
                item={item}
                onEdit={openEditForm}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}