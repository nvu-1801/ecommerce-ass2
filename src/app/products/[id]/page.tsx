export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import DeleteProductButton from "@/components/DeleteProductButton";
import SafeImage from "@/components/SafeImage";

const formatVND = (n: number) =>
  Number(n).toLocaleString("vi-VN", { style: "currency", currency: "VND" });

export default async function ProductDetail(
  props: { params: Promise<{ id: string }> } // 👈 Promise
) {
  const { id } = await props.params;
  const p = await prisma.product.findUnique({ where: { id } });
  if (!p) return <div className="p-6">Not found</div>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link
            href="/products"
            className="text-sm text-zinc-600 hover:underline"
          >
            ← Back to list
          </Link>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            {p.name}
          </h1>
          <p className="text-zinc-600 mt-1">{formatVND(Number(p.price))}</p>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/products/${p.id}/edit`}
            className="px-3 py-2 border rounded-lg hover:bg-zinc-50"
          >
            Edit
          </Link>
          <DeleteProductButton id={p.id} />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-2xl overflow-hidden border bg-white">
          <div className="aspect-[4/5] bg-zinc-100">
            {p.image && (
              <SafeImage
                src={p.image}
                alt={p.name}
                className="h-full w-full object-cover"
              />
            )}
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-5">
          <h2 className="font-bold text-gray-700 mb-2">Description</h2>
          <p className="leading-relaxed text-zinc-700">{p.description}</p>
          <dl className="mt-6 grid grid-cols-2 gap-2 text-sm">
            <dt className="text-zinc-500">ID</dt>
            <dd className="font-mono text-gray-700">{p.id}</dd>
            <dt className="text-zinc-500">Created</dt>
            <dd>{new Date(p.createdAt).toLocaleString()}</dd>
            <dt className="text-zinc-500">Updated</dt>
            <dd>{new Date(p.updatedAt).toLocaleString()}</dd>
          </dl>
        </div>
      </div>
    </div>
  );
}
