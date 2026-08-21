"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, Plus } from "lucide-react";

import API_URL from "../../../services/api";
import IngredientCard from "../../../components/admin/IngredientCard";
import IngredientForm from "../../../components/admin/IngredientForm";

export default function AdminInventoryPage() {
  const [ingredients, setIngredients] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingIngredient, setEditingIngredient] =
    useState(null);

  const getToken = () => localStorage.getItem("token");
  const fetchIngredients = async () => {
    const token = getToken();

    if (!token) {
      setMessage(
        "You must be logged in as an admin."
      );
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/inventory`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message ||
            "Could not load inventory."
        );
        return;
      }

      setIngredients(data);
    } catch (error) {
      console.error(error);

      setMessage(
        "Could not connect to the server."
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchSuppliers = async () => {
    const token = getToken();

    if (!token) return;

    try {
      const response = await fetch(
        `${API_URL}/api/suppliers`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message ||
            "Could not load suppliers."
        );
        return;
      }

      setSuppliers(data);
    } catch (error) {
      console.error(error);

      setMessage(
        "Could not connect to the server."
      );
    }
  };

  const resetForm = () => {
    setEditingIngredient(null);
    setShowForm(false);
  };

  const openAddForm = () => {
    setEditingIngredient(null);
    setShowForm(true);
    setMessage("");
  };

  const openEditForm = (ingredient) => {
    setEditingIngredient(ingredient);
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
      const url = editingIngredient
        ? `${API_URL}/api/inventory/${editingIngredient._id}`
        : `${API_URL}/api/inventory`;

      const method = editingIngredient
        ? "PUT"
        : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message ||
            "Could not save ingredient."
        );
        return;
      }

      resetForm();
      await fetchIngredients();
    } catch (error) {
      console.error(error);

      setMessage(
        "Could not save ingredient."
      );
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this ingredient?"
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
        `${API_URL}/api/inventory/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message ||
            "Could not delete ingredient."
        );
        return;
      }

      await fetchIngredients();
    } catch (error) {
      console.error(error);

      setMessage(
        "Could not delete ingredient."
      );
    }
  };

  useEffect(() => {
    fetchIngredients();
    fetchSuppliers();
  }, []);

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
                Inventory
              </span>
            </h1>

            <p className="mt-4 text-zinc-400">
              Manage ingredients, stock levels,
              low-stock thresholds, and suppliers.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">

            <Link
              href="/admin/suppliers"
              className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-5 py-3 font-semibold text-white transition hover:bg-white/[0.1]"
            >
              Manage Suppliers
            </Link>

            <button
              onClick={openAddForm}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-400 px-5 py-3 font-semibold text-black transition hover:scale-105"
            >
              <Plus size={18} />
              Add Ingredient
            </button>

          </div>
        </div>

        {/* Error Message */}
        {message && (
          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {message}
          </div>
        )}

        {/* Add / Edit Ingredient Form */}
        {showForm && (
          <IngredientForm
            editingIngredient={editingIngredient}
            suppliers={suppliers}
            onSubmit={handleSubmit}
            onCancel={resetForm}
          />
        )}

        {/* Inventory */}
        {loading ? (
          <p className="text-center text-zinc-400">
            Loading inventory...
          </p>
        ) : ingredients.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-12 text-center">

            <Package
              size={40}
              className="mx-auto text-orange-300"
            />

            <p className="mt-4 text-zinc-400">
              No ingredients found.
            </p>

          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

            {ingredients.map((ingredient) => (
              <IngredientCard
                key={ingredient._id}
                ingredient={ingredient}
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