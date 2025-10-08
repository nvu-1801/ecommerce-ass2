// app/products/[id]/page.tsx
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import DeleteProductButton from "@/components/DeleteProductButton";
import SafeImage from "@/components/SafeImage";
import NeedsLoginButton from "@/components/NeedsLoginButton";
import { supabaseServer } from "../../../lib/supabase/supabase-server";
import {
  ArrowLeft,
  Pencil,
  Trash2,
  ShieldCheck,
  ImageIcon,
  CalendarClock,
  RefreshCcw,
} from "lucide-react";

const formatVND = (n: number) =>
  Number(n).toLocaleString("vi-VN", { style: "currency", currency: "VND" });

export default async function ProductDetail({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  const p = await prisma.product.findUnique({ where: { id } });
  if (!p) {
    return (
      <div className="min-h-[60vh] grid place-items-center bg-gradient-to-b from-indigo-50 via-white to-white">
        <div className="text-center">
          <p className="text-sm text-zinc-500 mb-2">404</p>
          <h1 className="text-2xl font-semibold">Product not found</h1>
          <Link
            href="/products"
            className="mt-4 inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to list
          </Link>
        </div>
      </div>
    );
  }

  // Lấy user server-side để quyết định render
  const sb = await supabaseServer();
  const {
    data: { user },
  } = await sb.auth.getUser();
  const isAuthed = !!user;

  return (
    <div className="min-h-screen bg-[radial-gradient(40rem_20rem_at_20%_10%,rgba(99,102,241,0.10),transparent),radial-gradient(40rem_20rem_at_80%_0%,rgba(236,72,153,0.10),transparent)]">
      {/* Top bar */}
      <div className="border-b bg-white/60 backdrop-blur supports-[backdrop-filter]:bg-white/40">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 text-zinc-700 hover:text-zinc-900"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="text-sm">Back</span>
              </Link>
              <span className="text-zinc-400">/</span>
              <span className="text-sm text-zinc-500">Product</span>
              <span className="text-zinc-400">/</span>
              <span className="text-sm font-medium text-zinc-900 line-clamp-1">
                {p.name}
              </span>
            </div>

            <div className="hidden md:flex items-center gap-2">
              {isAuthed ? (
                <>
                  <Link
                    href={`/products/${p.id}/edit`}
                    className="inline-flex items-center gap-2 rounded-xl border border-indigo-200 bg-white px-3 py-2 text-sm font-medium text-indigo-700 shadow-sm hover:bg-indigo-50 hover:border-indigo-300 transition"
                    title="Edit"
                  >
                    <Pencil className="h-4 w-4" />
                    Edit
                  </Link>
                  <DeleteProductButton id={p.id} />
                </>
              ) : (
                <>
                  <NeedsLoginButton label="Edit" className="inline-flex items-center gap-2 rounded-xl border bg-white px-3 py-2 text-sm font-medium text-zinc-700 shadow-sm hover:bg-zinc-50 transition" />
                  <NeedsLoginButton label="Delete" className="inline-flex items-center gap-2 rounded-xl border bg-white px-3 py-2 text-sm font-medium text-zinc-700 shadow-sm hover:bg-zinc-50 transition" />
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Hero + content */}
      <div className="mx-auto max-w-6xl px-4 py-8 md:py-10">
        {/* Title + price pill */}
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-emerald-700 text-xs font-medium">
              <ShieldCheck className="h-3.5 w-3.5" />
              Verified Product
            </div>
            <h1 className="mt-2 text-3xl md:text-4xl font-semibold tracking-tight text-zinc-900">
              {p.name}
            </h1>
            <div className="mt-2 flex items-center gap-4 text-sm text-zinc-500">
              <span className="inline-flex items-center gap-1.5">
                <CalendarClock className="h-4 w-4" />
                Created:&nbsp;{new Date(p.createdAt).toLocaleString()}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <RefreshCcw className="h-4 w-4" />
                Updated:&nbsp;{new Date(p.updatedAt).toLocaleString()}
              </span>
            </div>
          </div>

          <div className="inline-flex items-center rounded-2xl bg-gradient-to-r from-indigo-600 to-fuchsia-500 px-4 py-2 text-white shadow-lg">
            <span className="text-sm/none opacity-90 mr-2">Price</span>
            <span className="text-xl font-bold tracking-tight">
              {formatVND(Number(p.price))}
            </span>
          </div>
        </div>

        {/* Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Image card */}
          <div className="group relative overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm transition hover:shadow-xl">
            <div className="aspect-[4/5] bg-gradient-to-br from-zinc-50 to-zinc-100">
              {p.image ? (
                <SafeImage
                  src={p.image}
                  alt={p.name}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                />
              ) : (
                <div className="h-full w-full grid place-items-center text-zinc-400">
                  <div className="flex flex-col items-center">
                    <ImageIcon className="h-10 w-10 mb-2" />
                    <span className="text-sm">No image</span>
                  </div>
                </div>
              )}
            </div>

            {/* Glow accent */}
            <div className="pointer-events-none absolute inset-x-0 -bottom-10 h-24 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition" />
          </div>

          {/* Details card */}
          <div className="rounded-3xl border border-zinc-200 bg-white p-5 md:p-6 shadow-sm">
            <h2 className="font-semibold text-zinc-900">Description</h2>
            <p className="mt-2 leading-relaxed text-zinc-700 whitespace-pre-line">
              {p.description || "—"}
            </p>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                <dt className="text-xs uppercase tracking-wider text-zinc-500">
                  Product ID
                </dt>
                <dd className="mt-1 font-mono text-sm text-zinc-900 break-all">
                  {p.id}
                </dd>
              </div>

              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                <dt className="text-xs uppercase tracking-wider text-zinc-500">
                  Status
                </dt>
                <dd className="mt-1 inline-flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="text-sm text-zinc-900">Available</span>
                </dd>
              </div>
            </div>

            {/* Actions (mobile) */}
            <div className="mt-6 flex gap-2 md:hidden">
              {isAuthed ? (
                <>
                  <Link
                    href={`/products/${p.id}/edit`}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-indigo-200 bg-white px-3 py-2 text-sm font-medium text-indigo-700 shadow-sm hover:bg-indigo-50 hover:border-indigo-300 transition"
                  >
                    <Pencil className="h-4 w-4" />
                    Edit
                  </Link>
                  <DeleteProductButton id={p.id} />
                </>
              ) : (
                <>
                  <NeedsLoginButton label="Edit" className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border bg-white px-3 py-2 text-sm font-medium text-zinc-700 shadow-sm hover:bg-zinc-50 transition" />
                  <NeedsLoginButton label="Delete" className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border bg-white px-3 py-2 text-sm font-medium text-zinc-700 shadow-sm hover:bg-zinc-50 transition" />
                </>
              )}
            </div>

            {/* Danger hint */}
            {isAuthed && (
              <div className="mt-4 hidden md:flex items-center gap-2 text-xs text-red-600/90">
                <Trash2 className="h-4 w-4" />
                Deleting is permanent.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
