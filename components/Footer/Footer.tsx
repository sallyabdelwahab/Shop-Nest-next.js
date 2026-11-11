import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <Link href="/" className="text-lg font-bold tracking-tight text-slate-900">Shop<span className="text-violet-700">Nest</span></Link>
        <p>Thoughtful finds for your everyday life.</p>
        <p>© {new Date().getFullYear()} ShopNest. All rights reserved.</p>
      </div>
    </footer>
  );
}
