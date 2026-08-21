"use client";

import { useEffect, useState } from "react";

export default function SupplierForm({
  editingSupplier,
  onSubmit,
  onCancel,
}) {
  const [formData, setFormData] = useState({
    name: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    if (editingSupplier) {
      setFormData({
        name: editingSupplier.name || "",
        contactPerson:
          editingSupplier.contactPerson || "",
        email: editingSupplier.email || "",
        phone: editingSupplier.phone || "",
        address: editingSupplier.address || "",
      });
    } else {
      setFormData({
        name: "",
        contactPerson: "",
        email: "",
        phone: "",
        address: "",
      });
    }
  }, [editingSupplier]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-10 rounded-2xl border border-white/10 bg-white/[0.03] p-6"
    >
      <h2 className="text-xl font-semibold text-white">
        {editingSupplier
          ? "Edit Supplier"
          : "Add Supplier"}
      </h2>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <div>
          <label className="text-sm text-zinc-400">
            Supplier Name
          </label>

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-orange-400"
          />
        </div>

        <div>
          <label className="text-sm text-zinc-400">
            Contact Person
          </label>

          <input
            type="text"
            name="contactPerson"
            value={formData.contactPerson}
            onChange={handleChange}
            className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-orange-400"
          />
        </div>

        <div>
          <label className="text-sm text-zinc-400">
            Email
          </label>

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-orange-400"
          />
        </div>

        <div>
          <label className="text-sm text-zinc-400">
            Phone
          </label>

          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-orange-400"
          />
        </div>
      </div>

      <div className="mt-5">
        <label className="text-sm text-zinc-400">
          Address
        </label>

        <textarea
          name="address"
          value={formData.address}
          onChange={handleChange}
          rows={3}
          className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-orange-400"
        />
      </div>

      <div className="mt-6 flex gap-3">
        <button
          type="submit"
          className="rounded-xl bg-gradient-to-r from-orange-500 to-amber-400 px-5 py-3 font-semibold text-black"
        >
          {editingSupplier
            ? "Save Changes"
            : "Add Supplier"}
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-white/10 px-5 py-3 text-zinc-300 transition hover:bg-white/5"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}