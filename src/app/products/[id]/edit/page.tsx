// app/products/[id]/edit/page.tsx
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProductForm from "@/components/ProductForm";
import { ArrowLeft, Pencil } from "lucide-react";

export default async function EditProduct({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = await prisma.product.findUnique({ where: { id } });
  if (!p) notFound();

  return (
    <div className="min-h-screen bg-[radial-gradient(40rem_20rem_at_20%_10%,rgba(99,102,241,0.10),transparent),radial-gradient(40rem_20rem_at_80%_0%,rgba(236,72,153,0.10),transparent)]">
      <div className="border-b bg-white/60 backdrop-blur supports-[backdrop-filter]:bg-white/40">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/products" className="inline-flex items-center gap-2 text-zinc-700 hover:text-zinc-900">
                <ArrowLeft className="h-4 w-4" />
                <span className="text-sm">Back</span>
              </Link>
              <span className="text-zinc-400">/</span>
              <Link href={`/products/${p.id}`} className="text-sm text-zinc-500 hover:text-zinc-800">
                {p.name}
              </Link>
              <span className="text-zinc-400">/</span>
              <span className="text-sm font-medium text-zinc-900">Edit</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600/10">
            <Pencil className="h-5 w-5 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-zinc-900">
              Edit product
            </h1>
            <p className="text-sm text-zinc-600">Cập nhật thông tin sản phẩm của bạn với giao diện mới.</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 rounded-3xl border border-zinc-200 bg-white p-5 md:p-6 shadow-sm">
            <ProductForm
              id={p.id}
              defaultValues={{
                name: p.name,
                description: p.description ?? "",
                price: Number(p.price),
                image: p.image ?? "",
              }}
            />
          </div>

          <aside className="rounded-3xl border border-zinc-200 bg-white p-5 md:p-6 shadow-sm">
            <h3 className="font-medium text-zinc-900">Mẹo nhanh</h3>
            <ul className="mt-3 space-y-2 text-sm text-zinc-600">
              <li>• Ảnh đẹp (tối thiểu 1000×1250) giúp tăng chuyển đổi.</li>
              <li>• Mô tả nên ngắn gọn, có bullet, nêu lợi ích chính.</li>
              <li>• Giá nên theo VND, không dùng dấu chấm trong input.</li>
            </ul>
            <div className="mt-5 rounded-2xl bg-gradient-to-r from-indigo-600 to-fuchsia-500 p-4 text-white">
              <p className="text-sm/6 opacity-90">Tip</p>
              <p className="text-sm">Dán URL ảnh trực tiếp để xem preview tức thì.</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
