"use client";

import {
  Edit,
  Trash2,
  Mail,
  Phone,
  MapPin,
  User,
} from "lucide-react";

export default function SupplierCard({
  supplier,
  onEdit,
  onDelete,
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white">
            {supplier.name}
          </h2>

          {supplier.contactPerson && (
            <div className="mt-2 flex items-center gap-2 text-sm text-zinc-400">
              <User size={16} />

              {supplier.contactPerson}
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onEdit(supplier)}
            className="rounded-lg border border-white/10 p-2 text-zinc-300 transition hover:border-orange-400/40 hover:text-orange-300"
            title="Edit supplier"
          >
            <Edit size={18} />
          </button>

          <button
            onClick={() => onDelete(supplier._id)}
            className="rounded-lg border border-white/10 p-2 text-zinc-300 transition hover:border-red-400/40 hover:text-red-300"
            title="Delete supplier"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="mt-6 space-y-3 text-sm text-zinc-400">
        {supplier.email && (
          <div className="flex items-center gap-3">
            <Mail size={16} className="text-orange-300" />

            <span>{supplier.email}</span>
          </div>
        )}

        {supplier.phone && (
          <div className="flex items-center gap-3">
            <Phone size={16} className="text-orange-300" />

            <span>{supplier.phone}</span>
          </div>
        )}

        {supplier.address && (
          <div className="flex items-start gap-3">
            <MapPin
              size={16}
              className="mt-0.5 text-orange-300"
            />

            <span>{supplier.address}</span>
          </div>
        )}
      </div>
    </div>
  );
}