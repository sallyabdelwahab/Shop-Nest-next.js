"use client";

import Link from "next/link";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { Heart, Menu, ShoppingBag, ShoppingCart, X } from "lucide-react";
import { CartContext } from "../Context/CartContext";
import { useContext } from "react";

export default function Navbar() {
  const { isLoading, cartData } = useContext(CartContext);
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const cartCount = cartData?.data?.products?.reduce((total, item) => total + (item.count || 0), 0) ?? cartData?.numOfCartItems ?? 0;

  const closeMenu = () => setMenuOpen(false);
  const links = [
    { href: "/products", label: "Shop" },
    { href: "/categories", label: "Categories" },
    { href: "/brands", label: "Brands" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 shadow-sm shadow-slate-900/[0.03] backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" onClick={closeMenu} className="flex items-center gap-2 text-2xl font-bold tracking-tight text-slate-900">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-700 text-white"><ShoppingBag size={19} /></span>
          Shop<span className="text-violet-700">Nest</span>
        </Link>

        <div className="hidden items-center gap-9 md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm font-medium text-slate-600 transition hover:text-violet-700">{link.label}</Link>
          ))}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {status === "authenticated" ? (
            <>
              <span className="hidden text-sm text-slate-500 lg:inline">Hi, {session?.user?.name}</span>
              <Link href="/wish" aria-label="Favorites" className="rounded-full p-2 text-slate-600 transition hover:bg-violet-50 hover:text-violet-700"><Heart size={20} /></Link>
              <Link href="/cart" aria-label="Shopping cart" className="relative rounded-full p-2 text-slate-600 transition hover:bg-violet-50 hover:text-violet-700">
                <ShoppingCart size={20} />
                {!isLoading && cartCount > 0 && <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-violet-700 px-1 text-[10px] font-bold text-white">{cartCount}</span>}
              </Link>
              <div className="hidden items-center gap-3 border-l border-slate-200 pl-3 sm:flex">
                <Link href="/profile" className="text-sm font-medium text-slate-600 hover:text-violet-700">Account</Link>
                <button onClick={() => signOut({ callbackUrl: "/" })} className="text-sm font-medium text-slate-500 hover:text-violet-700">Log out</button>
              </div>
            </>
          ) : (
            <>
              <Link href="/login" className="hidden rounded-full px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-violet-50 hover:text-violet-700 sm:inline-flex">Log in</Link>
              <Link href="/register" className="hidden rounded-full bg-violet-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-800 sm:inline-flex">Sign up</Link>
            </>
          )}
          <button onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? "Close menu" : "Open menu"} className="rounded-full p-2 text-slate-700 hover:bg-slate-100 md:hidden">
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="border-t border-slate-100 bg-white px-4 py-4 shadow-lg md:hidden">
          <div className="flex flex-col gap-1">
            {links.map((link) => <Link key={link.href} href={link.href} onClick={closeMenu} className="rounded-xl px-3 py-3 text-sm font-medium text-slate-700 hover:bg-violet-50">{link.label}</Link>)}
            {status === "authenticated" ? (
              <>
                <Link href="/allorders" onClick={closeMenu} className="rounded-xl px-3 py-3 text-sm font-medium text-slate-700 hover:bg-violet-50">My orders</Link>
                <Link href="/profile" onClick={closeMenu} className="rounded-xl px-3 py-3 text-sm font-medium text-slate-700 hover:bg-violet-50">My account</Link>
                <button onClick={() => signOut({ callbackUrl: "/" })} className="rounded-xl px-3 py-3 text-left text-sm font-medium text-slate-700 hover:bg-violet-50">Log out</button>
              </>
            ) : (
              <div className="mt-2 flex gap-2 border-t border-slate-100 pt-3">
                <Link href="/login" onClick={closeMenu} className="flex-1 rounded-full border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-700">Log in</Link>
                <Link href="/register" onClick={closeMenu} className="flex-1 rounded-full bg-violet-700 px-4 py-3 text-center text-sm font-semibold text-white">Sign up</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
