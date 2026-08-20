import Link from "next/link";
import {
  ArrowRight,
  Coffee,
  ShoppingBag,
  Clock3,
  Star,
  Check,
} from "lucide-react";

export default function Home() {
  return (
    <div className="overflow-hidden text-white">
      {/* HERO */}
      <section className="relative">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=2200&q=85"
            alt="Coffee shop"
            className="h-full w-full object-cover opacity-60"
          />

          <div className="absolute inset-0 bg-gradient-to-b from-[#09090b]/20 via-[#09090b]/45 to-[#09090b]/80" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#09090b]/60 via-[#09090b]/30 to-transparent" />
        </div>

        {/* Decorative glow */}
        <div className="absolute left-1/4 top-32 h-96 w-96 rounded-full bg-orange-500/10 blur-3xl" />
        <div className="absolute right-0 top-40 h-80 w-80 rounded-full bg-amber-400/10 blur-3xl" />

        <div className="relative mx-auto flex min-h-[calc(100vh-73px)] max-w-7xl items-center px-6 py-24">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-400/20 bg-orange-400/10 px-4 py-2 text-sm font-medium text-orange-200 backdrop-blur">
              <Coffee size={16} />
              Fresh coffee. Easy ordering.
            </div>

            <h1 className="text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              Your favourite café,
              <span className="mt-2 block bg-gradient-to-r from-orange-300 via-amber-300 to-yellow-100 bg-clip-text text-transparent">
                right at your fingertips.
              </span>
            </h1>

            <p className="mt-8 max-w-2xl text-lg leading-8 text-zinc-300 sm:text-xl">
              From your morning coffee to your favourite meal, browse the menu,
              place your order, and track it every step of the way.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/menu"
                className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-400 px-7 py-4 font-semibold text-black shadow-lg shadow-orange-500/20 transition hover:scale-105 hover:shadow-orange-500/30"
              >
                Explore Menu
                <ArrowRight
                  size={18}
                  className="transition group-hover:translate-x-1"
                />
              </Link>

              <Link
                href="/register"
                className="rounded-xl border border-white/15 bg-black/20 px-7 py-4 font-semibold text-white backdrop-blur transition hover:bg-white/10"
              >
                Create Account
              </Link>
            </div>

            {/* Small stats */}
            <div className="mt-14 flex flex-wrap gap-8 border-t border-white/10 pt-8">
              <div>
                <p className="text-2xl font-bold text-orange-300">Fresh</p>
                <p className="mt-1 text-sm text-zinc-400">
                  Made to order
                </p>
              </div>

              <div>
                <p className="text-2xl font-bold text-orange-300">Easy</p>
                <p className="mt-1 text-sm text-zinc-400">
                  Online ordering
                </p>
              </div>

              <div>
                <p className="text-2xl font-bold text-orange-300">Live</p>
                <p className="mt-1 text-sm text-zinc-400">
                  Order tracking
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE SECTION */}
      <section className="border-y border-white/5 bg-[#0d0d0f] px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange-300">
              Everything you need
            </p>

            <h2 className="mt-4 text-4xl font-bold sm:text-5xl">
              Ordering coffee has never been{" "}
              <span className="text-orange-300">easier.</span>
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="group rounded-3xl border border-white/10 bg-white/[0.03] p-8 transition hover:-translate-y-2 hover:border-orange-400/30 hover:bg-white/[0.05]">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-400/10 text-orange-300">
                <Coffee size={24} />
              </div>

              <h3 className="text-xl font-semibold">
                Browse the Menu
              </h3>

              <p className="mt-3 leading-7 text-zinc-400">
                Explore our selection of coffee, drinks, and delicious food
                whenever you want.
              </p>
            </div>

            <div className="group rounded-3xl border border-white/10 bg-white/[0.03] p-8 transition hover:-translate-y-2 hover:border-orange-400/30 hover:bg-white/[0.05]">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-400/10 text-orange-300">
                <ShoppingBag size={24} />
              </div>

              <h3 className="text-xl font-semibold">
                Order in Seconds
              </h3>

              <p className="mt-3 leading-7 text-zinc-400">
                Add your favourites to your cart, review your order, and check
                out with ease.
              </p>
            </div>

            <div className="group rounded-3xl border border-white/10 bg-white/[0.03] p-8 transition hover:-translate-y-2 hover:border-orange-400/30 hover:bg-white/[0.05]">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-400/10 text-orange-300">
                <Clock3 size={24} />
              </div>

              <h3 className="text-xl font-semibold">
                Track Your Order
              </h3>

              <p className="mt-3 leading-7 text-zinc-400">
                Follow your order from pending to in progress and know exactly
                when it is ready.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* IMAGE + CONTENT SECTION */}
      <section className="px-6 py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
          <div className="relative">
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-orange-500/20 to-amber-300/5 blur-2xl" />

            <img
              src="https://images.unsplash.com/photo-1445116572660-236099ec97a0?auto=format&fit=crop&w=1400&q=85"
              alt="Cozy cafe interior"
              className="relative h-[500px] w-full rounded-[2rem] border border-white/10 object-cover"
            />

            <div className="absolute -bottom-6 -right-3 rounded-2xl border border-white/10 bg-[#18120d]/90 p-5 shadow-2xl backdrop-blur sm:right-8">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-400 text-black">
                  <Star size={20} fill="currentColor" />
                </div>

                <div>
                  <p className="font-semibold text-white">
                    Made for coffee lovers
                  </p>
                  <p className="text-sm text-zinc-400">
                    Freshly prepared every day
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange-300">
              More than just coffee
            </p>

            <h2 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl">
              Good food.
              <br />
              Great coffee.
              <br />
              <span className="text-orange-300">
                No waiting around.
              </span>
            </h2>

            <p className="mt-6 max-w-xl text-lg leading-8 text-zinc-400">
              CafeMS makes ordering simple. Browse what you want, add it to
              your cart, and let us handle the rest.
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3 text-zinc-300">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-400/10 text-orange-300">
                  <Check size={16} />
                </div>

                Fresh food and drinks
              </div>

              <div className="flex items-center gap-3 text-zinc-300">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-400/10 text-orange-300">
                  <Check size={16} />
                </div>

                Simple and fast online ordering
              </div>

              <div className="flex items-center gap-3 text-zinc-300">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-400/10 text-orange-300">
                  <Check size={16} />
                </div>

                Real-time order status tracking
              </div>
            </div>

            <Link
              href="/menu"
              className="mt-10 inline-flex items-center gap-2 font-semibold text-orange-300 transition hover:text-orange-200"
            >
              View our menu
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}

      <section className="px-6 pb-28">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-orange-400/20 bg-gradient-to-r from-[#24140a] via-[#1b130e] to-[#120f0d] px-8 py-16 text-center sm:px-16 sm:py-20">
          <div className="absolute left-1/4 top-0 h-64 w-64 rounded-full bg-orange-500/10 blur-3xl" />
          
          <div className="absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-amber-400/10 blur-3xl" />

          <div className="relative">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange-300">
              Ready when you are
            </p>

            <h2 className="mx-auto mt-4 max-w-3xl text-4xl font-bold sm:text-5xl">
              Your next favourite order is just a few clicks away.
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-lg leading-7 text-zinc-400">
              Fresh coffee, delicious food, and simple online ordering — all in one place.
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 px-6 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-sm text-zinc-500 sm:flex-row">
          <p>
            © 2026 CafeMS. Cafe Management System.
          </p>

        </div>
      </footer>
    </div>
  );
}