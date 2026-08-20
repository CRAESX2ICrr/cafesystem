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

export default function DashboardPage() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchReport = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setMessage("You must be logged in.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${API_URL}/api/reports/sales`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          setMessage(
            data.message || "Could not load dashboard."
          );
          return;
        }

        setReport(data);
      } catch (error) {
        console.error(error);
        setMessage("Could not connect to the server.");
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, []);

  const exportCSV = () => {
    if (!report) return;

    const csvData = [
      ["Metric", "Value"],
      ["Total Orders", report.totalOrders],
      ["Total Items Sold", report.totalItemsSold],
      ["Total Sales", report.totalSales],
      ["Pending Orders", report.ordersByStatus.Pending],
      [
        "In-Progress Orders",
        report.ordersByStatus["In-Progress"],
      ],
      ["Ready Orders", report.ordersByStatus.Ready],
    ];

    const csvContent = csvData
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob(
      [csvContent],
      { type: "text/csv;charset=utf-8;" }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "cafems-sales-report.csv";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
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
    {
      title: "Total Sales",
      value: `$${report.totalSales.toFixed(2)}`,
      icon: DollarSign,
      description: "Revenue from all orders",
    },
    {
      title: "Total Orders",
      value: report.totalOrders,
      icon: ShoppingBag,
      description: "Orders received",
    },
    {
      title: "Items Sold",
      value: report.totalItemsSold,
      icon: Package,
      description: "Items across all orders",
    },
  ];

  const statuses = [
    {
      title: "Pending",
      value: report.ordersByStatus.Pending,
      icon: Clock,
    },
    {
      title: "In Progress",
      value: report.ordersByStatus["In-Progress"],
      icon: ChefHat,
    },
    {
      title: "Ready",
      value: report.ordersByStatus.Ready,
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="min-h-screen bg-[#09090b] px-6 py-12 text-white">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
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

        {/* Main Statistics */}
        <div className="grid gap-6 md:grid-cols-3">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-zinc-400">
                      {stat.title}
                    </p>

                    <p className="mt-3 text-3xl font-bold">
                      {stat.value}
                    </p>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-400/10 text-orange-300">
                    <Icon size={22} />
                  </div>
                </div>

                <p className="mt-5 text-sm text-zinc-500">
                  {stat.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Order Status */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold">
            Order Status
          </h2>

          <p className="mt-2 text-sm text-zinc-400">
            Current breakdown of customer orders.
          </p>

          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {statuses.map((status) => {
              const Icon = status.icon;

              return (
                <div
                  key={status.title}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Icon
                        size={20}
                        className="text-orange-300"
                      />

                      <span className="text-sm text-zinc-400">
                        {status.title}
                      </span>
                    </div>

                    <span className="text-3xl font-bold">
                      {status.value}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Management */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold">
            Management
          </h2>

          <div className="mt-6 grid gap-6 md:grid-cols-2">

            <Link
              href="/admin/menu"
              className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:-translate-y-1 hover:border-orange-400/40 hover:bg-white/[0.05]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-400/10 text-orange-300">
                <UtensilsCrossed size={22} />
              </div>

              <h3 className="mt-5 text-lg font-semibold">
                Manage Menu
              </h3>

              <p className="mt-2 text-sm leading-6 text-zinc-400">
                Add, edit, and remove cafe menu items.
              </p>
            </Link>

            <Link
              href="/admin/staff"
              className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:-translate-y-1 hover:border-orange-400/40 hover:bg-white/[0.05]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-400/10 text-orange-300">
                <Users size={22} />
              </div>

              <h3 className="mt-5 text-lg font-semibold">
                Manage Staff
              </h3>

              <p className="mt-2 text-sm leading-6 text-zinc-400">
                Create and manage staff accounts.
              </p>
            </Link>

          </div>
        </div>

      </div>
    </div>
  );
}