"use client";

import { useContext, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PackageOpen } from "lucide-react";
import { CartContext } from "@/components/Context/CartContext";
import { formatCurrency } from "@/lib/Helpers/formatPrice";

interface OrderItem {
  _id: string;
  totalOrderPrice: number;
  cartItems?: Array<{
    product?: { title?: string; imageCover?: string; brand?: { name?: string }; category?: { name?: string } };
  }>;
  createdAt?: string;
}

export default function AllOrders() {
  const { cartData, isLoading: cartLoading } = useContext(CartContext);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (cartLoading) return;
    let cancelled = false;

    async function loadOrders() {
      const userId = cartData?.data?.cartOwner || localStorage.getItem("userId");
      if (!userId) {
        setOrders([]);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`https://ecommerce.routemisr.com/api/v1/orders/user/${userId}`, { cache: "no-store" });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Could not load your orders");
        if (!cancelled) setOrders(Array.isArray(data) ? data : data.data || []);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Could not load your orders");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadOrders();
    return () => { cancelled = true; };
  }, [cartData?.data?.cartOwner, cartLoading]);

  if (loading) return <div className="flex min-h-[45vh] items-center justify-center text-sm text-slate-500">Loading your orders...</div>;

  return (
    <section className="py-6">
      <div className="mb-7"><p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-700">Your account</p><h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">My orders</h1><p className="mt-2 text-sm text-slate-500">{orders.length} {orders.length === 1 ? "order" : "orders"} found</p></div>
      {error && <p role="alert" className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      {orders.length ? (
        <div className="space-y-4">
          {orders.map((order) => {
            const firstProduct = order.cartItems?.[0]?.product;
            return (
              <article key={order._id} className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
                {firstProduct?.imageCover ? <Image src={firstProduct.imageCover} alt={firstProduct.title || "Ordered product"} width={104} height={104} className="h-24 w-24 rounded-xl object-cover" /> : <div className="flex h-24 w-24 items-center justify-center rounded-xl bg-violet-50 text-violet-700"><PackageOpen /></div>}
                <div className="min-w-0 flex-1"><h2 className="font-semibold text-slate-900">{firstProduct?.title || "ShopNest order"}</h2><p className="mt-1 text-sm text-slate-500">{firstProduct?.brand?.name || ""}{firstProduct?.category?.name ? ` · ${firstProduct.category.name}` : ""}</p>{order.createdAt && <p className="mt-2 text-xs text-slate-400">{new Date(order.createdAt).toLocaleDateString()}</p>}</div>
                <p className="font-semibold text-slate-900">{formatCurrency(order.totalOrderPrice)}</p>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="flex min-h-[35vh] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 text-center"><span className="rounded-2xl bg-white p-4 text-violet-700 shadow-sm"><PackageOpen size={28} /></span><h2 className="mt-5 text-xl font-semibold text-slate-900">No orders yet</h2><p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">When you place an order, you’ll find its details here.</p><Link href="/products" className="mt-5 rounded-full bg-violet-700 px-6 py-3 text-sm font-semibold text-white hover:bg-violet-800">Start shopping</Link></div>
      )}
    </section>
  );
}
