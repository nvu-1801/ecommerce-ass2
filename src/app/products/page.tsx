export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import SafeImage from "@/components/SafeImage";

// Infer item type from Prisma query
type ProductRow = Awaited<ReturnType<typeof prisma.product.findMany>>[number];

const formatVND = (n: number) =>
  Number(n).toLocaleString("vi-VN", { style: "currency", currency: "VND" });

export default async function ProductsPage() {
  try {
    const data = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });

    return (
      <div className="min-h-[calc(100vh-56px)] bg-gradient-to-b from-zinc-50 via-white to-zinc-50">
        <div className="max-w-6xl mx-auto px-5 py-10">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-semibold text-gray-700 tracking-tight">
                Products
              </h1>
              <p className="text-zinc-600 mt-1">
                {data.length} item{data.length !== 1 ? "s" : ""} • clothing
                catalog
              </p>
            </div>
            <Link
              href="/products/new"
              className="inline-flex items-center gap-2 rounded-xl bg-black text-white px-4 py-2 shadow-lg shadow-black/10 hover:shadow-black/20 transition-shadow"
            >
              <span className="i-[+]">＋</span>
              New Product
            </Link>
          </div>

          {/* Empty state */}
          {data.length === 0 ? (
            <div className="border rounded-2xl p-10 text-center bg-white">
              <p className="text-zinc-800 text-lg font-medium">
                No products yet
              </p>
              <p className="text-zinc-500 mt-1">
                Create your first product to get started.
              </p>
              <Link
                href="/products/new"
                className="mt-6 inline-block rounded-lg border px-4 py-2 hover:bg-zinc-50"
              >
                Create product
              </Link>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.map((p: ProductRow) => (
                <Link
                  key={p.id}
                  href={`/products/${p.id}`}
                  className="group relative overflow-hidden rounded-2xl border bg-white transition-all hover:-translate-y-0.5 hover:shadow-xl"
                >
                  {/* Image */}
                  <div className="aspect-[4/5] w-full overflow-hidden bg-zinc-100">
                    {p.image && (
                      <SafeImage
                        src={p.image}
                        alt={p.name}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>

                  {/* Body */}
                  <div className="p-4">
                    <h3 className="text-base text-gray-700 font-semibold line-clamp-1">
                      {p.name}
                    </h3>
                    <p className="mt-1 text-sm text-zinc-600 line-clamp-2">
                      {p.description}
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-[15px] text-gray-700 font-medium">
                        {formatVND(Number(p.price))}
                      </span>
                      <span className="rounded-full border px-2 py-0.5 text-xs text-zinc-600 bg-zinc-50">
                        View
                      </span>
                    </div>
                  </div>

                  {/* subtle gradient overlay on hover */}
                  <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-black/5 via-transparent to-transparent" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  } catch (e) {
    console.error("ProductsPage error:", e);
    return (
      <div className="p-6">
        Database is unavailable. Open <code>/api/health</code> to see the exact
        error.
      </div>
    );
  }
}
