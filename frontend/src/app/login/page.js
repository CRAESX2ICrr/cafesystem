"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, LogIn } from "lucide-react";
import API_URL from "../../services/api";
import { useAuth } from "../../context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Login failed");
        return;
      }

      login(data.token, data.user);

      router.push("/cart");
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-6 py-16 text-white">
      <div className="mx-auto w-full max-w-md">

        <div className="rounded-3xl border border-white/20 bg-[#17110e] p-8 shadow-2xl shadow-black/40">

          <div className="mb-8 text-center">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-400 shadow-lg shadow-orange-500/30">
              <LogIn size={24} className="text-black" />
            </div>

            <h1 className="text-3xl font-bold text-white">
              Welcome{" "}
              <span className="bg-gradient-to-r from-orange-300 to-amber-200 bg-clip-text text-transparent">
                Back
              </span>
            </h1>

            <p className="mt-3 text-sm text-zinc-400">
              Log in to your CafeMS account to continue.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-200">
                Email
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full rounded-xl border border-white/10 bg-[#0d0a08] py-3 pl-11 pr-4 text-white outline-none transition placeholder:text-zinc-500 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-200">
                Password
              </label>

              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                />

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full rounded-xl border border-white/10 bg-[#0d0a08] py-3 pl-11 pr-4 text-white outline-none transition placeholder:text-zinc-500 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20"
                />
              </div>
            </div>

            {message && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-400 px-6 py-3 font-semibold text-black shadow-lg shadow-orange-500/20 transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <LogIn size={18} />

              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-zinc-400">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-orange-300 transition hover:text-orange-200"
            >
              Create one
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}