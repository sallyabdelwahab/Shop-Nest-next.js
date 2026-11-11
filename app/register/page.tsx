"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Register() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");
    const rePassword = String(formData.get("rePassword") || "");
    const phone = String(formData.get("phone") || "").trim();

    if (password !== rePassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("https://ecommerce.routemisr.com/api/v1/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, rePassword, phone }),
      });
      const data = await response.json();
      if (!response.ok || data.message !== "success") {
        throw new Error(data.message || "Could not create your account.");
      }

      const loginResult = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (!loginResult?.ok) {
        router.push("/login?registered=true");
        return;
      }
      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto my-8 max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/[0.04] sm:p-9">
      <div className="mb-7 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 text-violet-700"><UserPlus size={25} /></span>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">Create your account</h1>
        <p className="mt-2 text-sm text-slate-500">Join ShopNest and find something you love.</p>
      </div>
      <form onSubmit={handleRegister} className="space-y-4">
        <div><label htmlFor="name" className="mb-1.5 block text-sm font-medium text-slate-700">Full name</label><Input id="name" name="name" required minLength={2} placeholder="Your name" /></div>
        <div><label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700">Email address</label><Input id="email" name="email" type="email" required placeholder="you@example.com" /></div>
        <div><label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-slate-700">Phone number</label><Input id="phone" name="phone" type="tel" required placeholder="Your phone number" /></div>
        <div><label htmlFor="password" className="mb-1.5 block text-sm font-medium text-slate-700">Password</label><Input id="password" name="password" type="password" required minLength={6} placeholder="At least 6 characters" /></div>
        <div><label htmlFor="rePassword" className="mb-1.5 block text-sm font-medium text-slate-700">Confirm password</label><Input id="rePassword" name="rePassword" type="password" required minLength={6} placeholder="Repeat your password" /></div>
        {error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
        <Button type="submit" disabled={loading} className="h-11 w-full bg-violet-700 text-white hover:bg-violet-800">{loading ? <Loader2 className="animate-spin" /> : "Create account"}</Button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-500">Already have an account? <Link href="/login" className="font-semibold text-violet-700 hover:text-violet-900">Log in</Link></p>
    </section>
  );
}
