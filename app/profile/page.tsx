"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ArrowRight, Heart, Package, UserRound } from "lucide-react";

export default function Profile() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/login");
  }, [status, router]);

  if (status === "loading" || status === "unauthenticated") {
    return <div className="flex min-h-[50vh] items-center justify-center text-sm text-slate-500">Loading your account...</div>;
  }

  return (
    <section className="mx-auto max-w-3xl py-6">
      <div className="rounded-3xl bg-gradient-to-br from-violet-700 to-indigo-800 p-8 text-white sm:p-10">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15"><UserRound size={27} /></span>
        <p className="mt-6 text-sm font-medium text-violet-100">Your ShopNest account</p>
        <h1 className="mt-2 text-3xl font-semibold">Welcome, {session?.user?.name || "Shopper"}</h1>
        <p className="mt-2 text-sm text-violet-100">{session?.user?.email}</p>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Link href="/allorders" className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-violet-200 hover:shadow-lg hover:shadow-violet-900/5">
          <span className="flex items-center gap-4"><span className="rounded-xl bg-violet-50 p-3 text-violet-700"><Package size={22} /></span><span><strong className="block text-slate-900">My orders</strong><small className="mt-1 block text-slate-500">View your purchases</small></span></span><ArrowRight size={18} className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-violet-700" />
        </Link>
        <Link href="/wish" className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-violet-200 hover:shadow-lg hover:shadow-violet-900/5">
          <span className="flex items-center gap-4"><span className="rounded-xl bg-rose-50 p-3 text-rose-600"><Heart size={22} /></span><span><strong className="block text-slate-900">My favorites</strong><small className="mt-1 block text-slate-500">Products you saved</small></span></span><ArrowRight size={18} className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-violet-700" />
        </Link>
      </div>
    </section>
  );
}
