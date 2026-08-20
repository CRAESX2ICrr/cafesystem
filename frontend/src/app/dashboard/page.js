"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  DollarSign,
  ShoppingBag,
  Package,
  Clock,
  ChefHat,
  CheckCircle2,
  Download,
  UtensilsCrossed,
  Users,
} from "lucide-react";

import API_URL from "../../services/api";
import { useAuth } from "../../context/AuthContext";

export default function DashboardPage() {
  const { token } = useAuth();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setMessage("You must be logged in.");
      setLoading(false);
      return;
    }

    fetch(`${API_URL}/api/reports/sales`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Could not load dashboard.");
        }

        setReport(data);
      })
      .catch((error) => {
        console.error(error);
        setMessage(error.message || "Could not connect to the server.");
      })
      .finally(() => setLoading(false));
  }, [token]);

  const exportCSV = () => {
    if (!report) return;

    const rows = [
      ["Metric", "Value"],
      ["Total Orders", report.totalOrders],
      ["Total Items Sold", report.totalItemsSold],
      ["Total Sales", report.totalSales],
      ["Pending Orders", report.ordersByStatus.Pending],
      ["In-Progress Orders", report.ordersByStatus["In-Progress"]],
      ["Ready Orders", report.ordersByStatus.Ready],
    ];

    const link = document.createElement("a");
    link.href = URL.createObjectURL(
      new Blob([rows.map((row) => row.join(",")).join("\n")], {
        type: "text/csv;charset=utf-8;",
      })
    );

    link.download = "cafems-sales-report.csv";
    link.click();

    URL.revokeObjectURL(link.href);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090b] px-6 py-16 text-white">
        <p className="text-center text-zinc-400">
          Loading dashboard...
        </p>
      </div>
    );
  }

  if (message) {
    return (
      <div className="min-h-screen bg-[#09090b] px-6 py-16 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-red-300">
            {message}
          </div>
        </div>
      </div>
    );
  }

  const stats = [
    ["Total Sales", `$${report.totalSales.toFixed(2)}`, DollarSign, "Revenue from all orders"],
    ["Total Orders", report.totalOrders, ShoppingBag, "Orders received"],
    ["Items Sold", report.totalItemsSold, Package, "Items across all orders"],
  ];

  const statuses = [
    ["Pending", report.ordersByStatus.Pending, Clock],
    ["In Progress", report.ordersByStatus["In-Progress"], ChefHat],
    ["Ready", report.ordersByStatus.Ready, CheckCircle2],
  ];

  const management = [
    ["/admin/menu", UtensilsCrossed, "Manage Menu", "Add, edit, and remove cafe menu items."],
    ["/admin/staff", Users, "Manage Staff", "Create and manage staff accounts."],
  ];

  return (
    <div className="min-h-screen bg-[#09090b] px-6 py-12 text-white">
      <div className="mx-auto max-w-7xl">

        <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-orange-300">
              Admin Dashboard
            </p>

            <h1 className="text-4xl font-bold sm:text-5xl">
              Cafe
              <span className="bg-gradient-to-r from-orange-300 via-amber-300 to-yellow-200 bg-clip-text text-transparent">
                MS Overview
              </span>
            </h1>

            <p className="mt-4 text-zinc-400">
              Monitor sales and manage your cafe.
            </p>
          </div>

          <button
            onClick={exportCSV}
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-400 px-5 py-3 font-semibold text-black transition hover:scale-105"
          >
            <Download size={18} />
            Export CSV
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {stats.map(([title, value, Icon, description]) => (
            <div
              key={title}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-zinc-400">{title}</p>
                  <p className="mt-3 text-3xl font-bold">{value}</p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-400/10 text-orange-300">
                  <Icon size={22} />
                </div>
              </div>

              <p className="mt-5 text-sm text-zinc-500">
                {description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12">
          <h2 className="text-xl font-semibold">
            Order Status
          </h2>

          <p className="mt-2 text-sm text-zinc-400">
            Current breakdown of customer orders.
          </p>

          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {statuses.map(([title, value, Icon]) => (
              <div
                key={title}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Icon size={20} className="text-orange-300" />

                    <span className="text-sm text-zinc-400">
                      {title}
                    </span>
                  </div>

                  <span className="text-3xl font-bold">
                    {value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-xl font-semibold">
            Management
          </h2>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {management.map(([href, Icon, title, description]) => (
              <Link
                key={href}
                href={href}
                className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:-translate-y-1 hover:border-orange-400/40 hover:bg-white/[0.05]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-400/10 text-orange-300">
                  <Icon size={22} />
                </div>

                <h3 className="mt-5 text-lg font-semibold">
                  {title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  {description}
                </p>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}