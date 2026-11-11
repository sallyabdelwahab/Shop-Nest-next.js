"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { ArrowRight, BadgeCheck, Headphones, ShieldCheck, Sparkles, Truck } from "lucide-react";

const categories = [
  { name: "Women's Fashion", detail: "Everyday pieces, elevated", icon: "✦", color: "bg-rose-50 text-rose-700" },
  { name: "Men's Fashion", detail: "The essentials, refined", icon: "◈", color: "bg-sky-50 text-sky-700" },
  { name: "Home & Living", detail: "Make room for comfort", icon: "⌂", color: "bg-amber-50 text-amber-700" },
  { name: "Beauty", detail: "Little things, big difference", icon: "✿", color: "bg-violet-50 text-violet-700" },
];

export default function HomePage() {
  const { status } = useSession();
  const isSignedIn = status === "authenticated";

  return (
    <main className="-mt-4">
      <section className="relative isolate overflow-hidden rounded-[2rem] bg-[#f5f1fb]">
        <div className="grid min-h-[570px] items-center lg:grid-cols-[1.02fr_0.98fr]">
          <div className="relative z-10 px-7 py-16 sm:px-12 lg:px-16 lg:py-20">
            <span className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-violet-700">
              <Sparkles size={14} /> A little more you, every day
            </span>
            <h1 className="mt-7 max-w-xl text-4xl font-semibold leading-[1.12] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Find your next <span className="text-violet-700">favorite</span> thing.
            </h1>
            <p className="mt-6 max-w-lg text-base leading-8 text-slate-600 sm:text-lg">
              Thoughtful finds for your everyday life. Explore styles, discover something new, and make every purchase feel just right.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link href="/products" className="inline-flex items-center gap-3 rounded-full bg-violet-700 px-7 py-4 text-sm font-semibold text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 hover:bg-violet-800">
                Explore collection <ArrowRight size={17} />
              </Link>
              {!isSignedIn && (
                <Link href="/register" className="rounded-full border border-slate-300 bg-white/70 px-7 py-4 text-sm font-semibold text-slate-700 transition hover:border-violet-400 hover:text-violet-700">Create an account</Link>
              )}
            </div>
            <div className="mt-12 flex flex-wrap gap-x-7 gap-y-3 text-sm text-slate-500">
              <span className="inline-flex items-center gap-2"><BadgeCheck size={17} className="text-violet-700" /> Curated finds</span>
              <span className="inline-flex items-center gap-2"><ShieldCheck size={17} className="text-violet-700" /> Secure checkout</span>
            </div>
          </div>
          <div className="relative min-h-[360px] px-6 pb-10 sm:px-10 lg:min-h-[570px] lg:px-8 lg:py-10">
            <div className="absolute inset-5 rounded-[2rem] bg-gradient-to-br from-violet-200 via-[#e7dcf4] to-rose-100 lg:inset-8" />
            <div className="absolute right-8 top-10 h-24 w-24 rounded-full bg-white/50 blur-2xl sm:right-16" />
            <div className="relative mx-auto flex h-full max-w-[520px] items-center justify-center">
              <div className="absolute left-3 top-12 z-10 w-36 rotate-[-8deg] rounded-2xl bg-white p-3 shadow-xl shadow-violet-900/10 sm:left-8 sm:w-44">
                <div className="h-28 rounded-xl bg-cover bg-center sm:h-36" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&auto=format&fit=crop&q=80)" }} />
                <p className="mt-3 text-xs font-semibold text-slate-800">Everyday essentials</p>
                <p className="mt-1 text-[11px] text-slate-500">Made for your rhythm</p>
              </div>
              <div className="relative z-0 w-[68%] max-w-[300px] rotate-[3deg] rounded-[2rem] bg-white p-3 shadow-2xl shadow-violet-900/15 sm:p-4">
                <div className="h-[290px] rounded-[1.5rem] bg-cover bg-center sm:h-[350px]" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900&auto=format&fit=crop&q=85)" }} />
                <div className="flex items-center justify-between px-2 pb-1 pt-4">
                  <div><p className="text-sm font-semibold text-slate-900">The daily edit</p><p className="mt-1 text-xs text-slate-500">Your new go-to</p></div>
                  <span className="rounded-full bg-violet-50 px-3 py-2 text-xs font-semibold text-violet-700">Explore</span>
                </div>
              </div>
              <div className="absolute bottom-10 right-0 z-10 w-36 rotate-[7deg] rounded-2xl bg-white p-3 shadow-xl shadow-violet-900/10 sm:right-5 sm:w-44">
                <div className="h-28 rounded-xl bg-cover bg-center sm:h-36" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80)" }} />
                <p className="mt-3 text-xs font-semibold text-slate-800">Small details</p>
                <p className="mt-1 text-[11px] text-slate-500">Big on personality</p>
              </div>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full border border-white/70 bg-white/75 px-4 py-2 text-xs font-medium text-slate-600 shadow-sm backdrop-blur">A better way to shop</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-700">Explore your style</p><h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">Shop by category</h2></div>
          <Link href="/categories" className="inline-flex items-center gap-2 text-sm font-semibold text-violet-700 hover:text-violet-900">View all categories <ArrowRight size={16} /></Link>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {categories.map((category) => (
            <Link key={category.name} href="/categories" className="group rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-violet-200 hover:shadow-lg hover:shadow-violet-900/5">
              <span className={`flex h-14 w-14 items-center justify-center rounded-2xl text-2xl ${category.color}`}>{category.icon}</span>
              <h3 className="mt-5 text-lg font-semibold text-slate-900">{category.name}</h3>
              <p className="mt-1 text-sm text-slate-500">{category.detail}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-violet-700">Discover <ArrowRight size={15} className="transition group-hover:translate-x-1" /></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mb-8 rounded-[2rem] bg-slate-950 px-7 py-10 text-white sm:px-12 sm:py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="flex gap-4"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10"><Truck size={22} /></span><div><h3 className="font-semibold">Convenient delivery</h3><p className="mt-2 text-sm leading-6 text-slate-400">A smoother shopping experience, from browsing to your doorstep.</p></div></div>
          <div className="flex gap-4"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10"><ShieldCheck size={22} /></span><div><h3 className="font-semibold">Secure shopping</h3><p className="mt-2 text-sm leading-6 text-slate-400">Shop with confidence through a simple, secure checkout experience.</p></div></div>
          <div className="flex gap-4"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10"><Headphones size={22} /></span><div><h3 className="font-semibold">Here to help</h3><p className="mt-2 text-sm leading-6 text-slate-400">A clear and easy experience whenever you need a hand.</p></div></div>
        </div>
      </section>
    </main>
  );
}
