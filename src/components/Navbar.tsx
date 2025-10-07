import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/50">
      <nav className="max-w-6xl mx-auto h-14 px-4 flex items-center justify-between">
        <Link href="/products" className="font-semibold tracking-tight">
          <span className="inline-block rounded-lg bg-black text-white px-2.5 py-1 mr-2">Clothes Manager</span>
          Shop của Vũ
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href="/products"
            className="px-3 py-1.5 rounded-lg hover:bg-zinc-100 transition-colors"
          >
            Products
          </Link>
          <Link
            href="/products/new"
            className="px-3 py-1.5 rounded-lg bg-black text-white hover:opacity-90 transition"
          >
            New
          </Link>
        </div>
      </nav>
    </header>
  );
}
