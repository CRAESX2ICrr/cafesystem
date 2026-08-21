import {
  AlertTriangle,
  Pencil,
  Trash2,
} from "lucide-react";

export default function IngredientCard({
  ingredient,
  onEdit,
  onDelete,
}) {
  const isLowStock =
    ingredient.quantity <=
    ingredient.lowStockThreshold;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      {/* Top Section */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">
            {ingredient.name}
          </h2>

          {ingredient.supplier && (
            <p className="mt-1 text-sm text-zinc-400">
              Supplier:{" "}
              {ingredient.supplier.name}
            </p>
          )}
        </div>

        {isLowStock && (
          <AlertTriangle
            size={22}
            className="text-yellow-400"
          />
        )}
      </div>

      {/* Stock Information */}
      <div className="mt-6 space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-zinc-400">
            Current Stock
          </span>

          <span className="font-semibold">
            {ingredient.quantity}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-zinc-400">
            Low Stock At
          </span>

          <span>
            {ingredient.lowStockThreshold}
          </span>
        </div>
      </div>

      {/* Low Stock Alert */}
      {isLowStock && (
        <div className="mt-5 flex items-center gap-2 rounded-xl border border-yellow-500/20 bg-yellow-500/10 px-3 py-2 text-sm text-yellow-300">
          <AlertTriangle size={16} />

          Low stock — restocking needed.
        </div>
      )}

      {/* Actions */}
      <div className="mt-6 flex gap-3 border-t border-white/10 pt-5">
        <button
          onClick={() => onEdit(ingredient)}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-orange-500/30 bg-orange-500/10 px-4 py-2.5 text-sm font-semibold text-orange-300 transition hover:bg-orange-500/20"
        >
          <Pencil size={16} />

          Edit
        </button>

        <button
          onClick={() => onDelete(ingredient._id)}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm font-semibold text-red-300 transition hover:bg-red-500/20"
        >
          <Trash2 size={16} />

          Delete
        </button>
      </div>
    </div>
  );
}