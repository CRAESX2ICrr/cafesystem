"use client";

import { useEffect, useState } from "react";
import {
  Plus, Pencil, UserX, UserCheck, Trash2, X, Users, Save, Mail, User, Lock, CheckCircle2, XCircle,
} from "lucide-react";

import API_URL from "../../../services/api";

export default function AdminStaffPage() {
  const [staffMembers, setStaffMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const getToken = () => {
    return localStorage.getItem("token");
  };

  const fetchStaff = async () => {
    try {
      setLoading(true);

      const token = getToken();

      if (!token) {
        setMessage("You must be logged in as an admin.");
        return;
      }

      const response = await fetch(`${API_URL}/api/staff`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Could not load staff.");
        return;
      }

      setStaffMembers(data);
    } catch (error) {
      console.error(error);
      setMessage("Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setEditingStaff(null);
    setShowForm(false);
  };

  const openAddForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setEditingStaff(null);
    setShowForm(true);
    setMessage("");
  };

  const openEditForm = (staff) => {
    setEditingStaff(staff);
    setName(staff.name || "");
    setEmail(staff.email || "");
    setPassword("");
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
      const url = editingStaff
        ? `${API_URL}/api/staff/${editingStaff._id}`
        : `${API_URL}/api/staff`;

      const method = editingStaff ? "PUT" : "POST";

      const body = editingStaff
        ? {
            name,
            email,
          }
        : {
            name,
            email,
            password,
          };

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Could not save staff member.");
        return;
      }

      resetForm();
      await fetchStaff();
    } catch (error) {
      console.error(error);
      setMessage("Could not save staff member.");
    }
  };

  const handleDisable = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to disable this staff account?"
    );

    if (!confirmed) return;

    const token = getToken();

    if (!token) {
      setMessage("You must be logged in as an admin.");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/staff/${id}/disable`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Could not disable staff account.");
        return;
      }

      await fetchStaff();
    } catch (error) {
      console.error(error);
      setMessage("Could not disable staff account.");
    }
  };

  const handleEnable = async (id) => {
  const confirmed = window.confirm(
    "Are you sure you want to enable this staff account?"
  );

  if (!confirmed) return;

  const token = getToken();

  try {
    const response = await fetch(
      `${API_URL}/api/staff/${id}/enable`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      setMessage(data.message || "Could not enable staff account.");
      return;
    }

    await fetchStaff();
  } catch (error) {
    console.error(error);
    setMessage("Could not enable staff account.");
  }
};

const handleDelete = async (id, staffName) => {
  const confirmed = window.confirm(
    `Are you sure you want to permanently delete ${staffName}?`
  );

  if (!confirmed) return;

  const token = getToken();

  try {
    const response = await fetch(
      `${API_URL}/api/staff/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      setMessage(data.message || "Could not delete staff account.");
      return;
    }

    await fetchStaff();
  } catch (error) {
    console.error(error);
    setMessage("Could not delete staff account.");
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
                Staff
              </span>
            </h1>

            <p className="mt-4 text-zinc-400">
              Create, update, and manage staff accounts.
            </p>
          </div>

          <button
            onClick={openAddForm}
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-400 px-5 py-3 font-semibold text-black transition hover:scale-105"
          >
            <Plus size={18} />
            Add Staff
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
                {editingStaff ? "Edit Staff Member" : "Add Staff Member"}
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
                  Name
                </label>

                <div className="relative">
                  <User
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
                  />

                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Staff member name"
                    required
                    className="w-full rounded-xl border border-white/10 bg-black/20 py-3 pl-11 pr-4 text-white outline-none transition placeholder:text-zinc-600 focus:border-orange-400"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-300">
                  Email
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
                  />

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="staff@example.com"
                    required
                    className="w-full rounded-xl border border-white/10 bg-black/20 py-3 pl-11 pr-4 text-white outline-none transition placeholder:text-zinc-600 focus:border-orange-400"
                  />
                </div>
              </div>

              {/* Password - only when creating */}
              {!editingStaff && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-300">
                    Password
                  </label>

                  <div className="relative">
                    <Lock
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
                    />

                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a password"
                      required
                      className="w-full rounded-xl border border-white/10 bg-black/20 py-3 pl-11 pr-4 text-white outline-none transition placeholder:text-zinc-600 focus:border-orange-400"
                    />
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3 md:col-span-2">
                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-400 px-5 py-3 font-semibold text-black transition hover:scale-105"
                >
                  <Save size={18} />

                  {editingStaff ? "Save Changes" : "Create Staff Account"}
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

        {/* Staff List */}
        {loading ? (
          <p className="text-center text-zinc-400">
            Loading staff...
          </p>
        ) : staffMembers.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-12 text-center">
            <Users
              size={40}
              className="mx-auto text-orange-300"
            />

            <p className="mt-4 text-zinc-400">
              No staff members found.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {staffMembers.map((staff) => (
              <div
                key={staff._id}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold">
                      {staff.name}
                    </h2>

                    <p className="mt-2 text-sm text-zinc-400">
                      {staff.email}
                    </p>
                  </div>

                  {staff.active === false ? (
                    <span className="flex items-center gap-1 rounded-full bg-red-500/10 px-3 py-1 text-xs font-medium text-red-300">
                      <XCircle size={14} />
                      Disabled
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-300">
                      <CheckCircle2 size={14} />
                      Active
                    </span>
                  )}
                </div>

                <div className="mt-6 flex items-center justify-end gap-2 border-t border-white/10 pt-4">

                {/* Edit */}
                <button
                    onClick={() => openEditForm(staff)}
                    title="Edit staff"
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-zinc-300 transition hover:border-orange-400/40 hover:text-orange-300"
                >
                    <Pencil size={17} />
                </button>

                {/* Delete */}
                <button
                    onClick={() => handleDelete(staff._id, staff.name)}
                    title="Delete staff"
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-zinc-300 transition hover:border-red-400/40 hover:bg-red-500/10 hover:text-red-400"
                >
                    <Trash2 size={17} />
                </button>

                {/* Disable or Enable */}
                {staff.active !== false ? (
                    <button
                    onClick={() => handleDisable(staff._id)}
                    className="flex h-10 items-center gap-2 rounded-lg border border-white/10 px-3 text-sm text-zinc-300 transition hover:border-red-400/40 hover:text-red-400"
                    >
                    <UserX size={16} />
                    Disable
                    </button>
                ) : (
                    <button
                    onClick={() => handleEnable(staff._id)}
                    className="flex h-10 items-center gap-2 rounded-lg border border-white/10 px-3 text-sm text-zinc-300 transition hover:border-green-400/40 hover:text-green-400"
                    >
                    <UserCheck size={16} />
                    Enable
                    </button>
                )}

                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}