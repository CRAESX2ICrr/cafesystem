"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Truck,
  Pencil,
  Trash2,
} from "lucide-react";

import API_URL from "../../../services/api";

export default function AdminSuppliersPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingSupplier, setEditingSupplier] =
    useState(null);

  const [formData, setFormData] = useState({
    name: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
  });

  const getToken = () => {
    return localStorage.getItem("token");
  };

  const fetchSuppliers = async () => {
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const resetForm = () => {
    setEditingSupplier(null);

    setFormData({
      name: "",
      contactPerson: "",
      email: "",
      phone: "",
      address: "",
    });

    setShowForm(false);
  };

  const openAddForm = () => {
    resetForm();
    setShowForm(true);
    setMessage("");
  };

  const openEditForm = (supplier) => {
    setEditingSupplier(supplier);

    setFormData({
      name: supplier.name || "",
      contactPerson:
        supplier.contactPerson || "",
      email: supplier.email || "",
      phone: supplier.phone || "",
      address: supplier.address || "",
    });

    setShowForm(true);
    setMessage("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");

    const token = getToken();

    if (!token) {
      setMessage(
        "You must be logged in as an admin."
      );
      return;
    }

    try {
      const url = editingSupplier
        ? `${API_URL}/api/suppliers/${editingSupplier._id}`
        : `${API_URL}/api/suppliers`;

      const method = editingSupplier
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
            "Could not save supplier."
        );
        return;
      }

      resetForm();

      await fetchSuppliers();
    } catch (error) {
      console.error(error);

      setMessage(
        "Could not save supplier."
      );
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this supplier?"
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
        `${API_URL}/api/suppliers/${id}`,
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
            "Could not delete supplier."
        );
        return;
      }

      await fetchSuppliers();
    } catch (error) {
      console.error(error);

      setMessage(
        "Could not delete supplier."
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] px-6 py-12 text-white">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-orange-300">
              Admin
            </p>

            <h1 className="text-4xl font-bold sm:text-5xl">
              Manage{" "}

              <span className="bg-gradient-to-r from-orange-300 via-amber-300 to-yellow-200 bg-clip-text text-transparent">
                Suppliers
              </span>
            </h1>

            <p className="mt-4 text-zinc-400">
              Store supplier details for ingredient
              restocking and reordering.
            </p>
          </div>

          <button
            onClick={openAddForm}
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-400 px-5 py-3 font-semibold text-black transition hover:scale-105"
          >
            <Plus size={18} />
            Add Supplier
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
          <form
            onSubmit={handleSubmit}
            className="mb-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6"
          >
            <h2 className="text-xl font-semibold">
              {editingSupplier
                ? "Edit Supplier"
                : "Add Supplier"}
            </h2>

            <div className="mt-6 grid gap-4 md:grid-cols-2">

              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Supplier Name"
                required
                className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-orange-400"
              />

              <input
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleChange}
                placeholder="Contact Person"
                className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-orange-400"
              />

              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-orange-400"
              />

              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone"
                className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-orange-400"
              />

              <input
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Address"
                className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-orange-400 md:col-span-2"
              />

            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="submit"
                className="rounded-xl bg-gradient-to-r from-orange-500 to-amber-400 px-5 py-3 font-semibold text-black"
              >
                {editingSupplier
                  ? "Update Supplier"
                  : "Save Supplier"}
              </button>

              <button
                type="button"
                onClick={resetForm}
                className="rounded-xl border border-white/10 px-5 py-3 text-zinc-300"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Suppliers */}
        {loading ? (
          <p className="text-center text-zinc-400">
            Loading suppliers...
          </p>
        ) : suppliers.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-12 text-center">
            <Truck
              size={40}
              className="mx-auto text-orange-300"
            />

            <p className="mt-4 text-zinc-400">
              No suppliers found.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {suppliers.map((supplier) => (
              <div
                key={supplier._id}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">
                      {supplier.name}
                    </h2>

                    <p className="mt-2 text-sm text-zinc-400">
                      {supplier.contactPerson}
                    </p>
                  </div>

                  <Truck
                    size={22}
                    className="text-orange-300"
                  />
                </div>

                <div className="mt-6 space-y-2 text-sm text-zinc-400">
                  {supplier.email && (
                    <p>{supplier.email}</p>
                  )}

                  {supplier.phone && (
                    <p>{supplier.phone}</p>
                  )}

                  {supplier.address && (
                    <p>{supplier.address}</p>
                  )}
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() =>
                      openEditForm(supplier)
                    }
                    className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm transition hover:border-orange-400"
                  >
                    <Pencil size={16} />
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(supplier._id)
                    }
                    className="flex items-center gap-2 rounded-xl border border-red-500/20 px-4 py-2 text-sm text-red-300 transition hover:bg-red-500/10"
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