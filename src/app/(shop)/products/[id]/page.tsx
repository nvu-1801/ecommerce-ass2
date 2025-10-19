// app/products/[id]/page.tsx
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import DeleteProductButton from "@/components/DeleteProductButton";
import SafeImage from "@/components/SafeImage";
import NeedsLoginButton from "@/components/NeedsLoginButton";
import { supabaseServer } from "@/lib/supabase/supabase-server";
import {
  ArrowLeft,
  Pencil,
  Trash2,
  ShieldCheck,
  ImageIcon,
  CalendarClock,
  RefreshCcw,
  Sparkles,
  Tag,
  BadgeCheck,
  Heart,
  Share2,
} from "lucide-react";

const formatVND = (n: number) =>
  Number(n).toLocaleString("vi-VN", { style: "currency", currency: "VND" });

export default async function ProductDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const p = await prisma.product.findUnique({ where: { id } });
  if (!p) {
    return (
      <div className="min-h-[60vh] grid place-items-center bg-gradient-to-br from-slate-50 via-white to-violet-50">
        <div className="text-center bg-white rounded-2xl shadow-lg border border-gray-100 p-12 max-w-md mx-4">
          <div className="inline-flex p-4 rounded-full bg-red-50 mb-4">
            <ImageIcon className="h-12 w-12 text-red-500" />
          </div>
          <p className="text-sm font-semibold text-red-600 mb-2">
            404 - Không tìm thấy
          </p>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Sản phẩm không tồn tại
          </h1>
          <p className="text-gray-600 mb-6">
            Sản phẩm bạn tìm kiếm có thể đã bị xóa hoặc không còn tồn tại.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold hover:from-violet-700 hover:to-fuchsia-700 shadow-lg shadow-violet-500/30 transition-all duration-200"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại danh sách
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

  const isNew =
    new Date().getTime() - p.createdAt.getTime() < 7 * 24 * 60 * 60 * 1000;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50">
      {/* Top bar */}
      <div className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur-xl shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-gray-700 hover:text-violet-600 hover:bg-violet-50 transition-all duration-200 font-medium"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Quay lại</span>
              </Link>
              <span className="text-gray-300">|</span>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-500">Sản phẩm</span>
                <span className="text-gray-300">/</span>
                <span className="font-semibold text-gray-900 line-clamp-1 max-w-[200px] md:max-w-none">
                  {p.name}
                </span>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-2">
              {isAuthed ? (
                <>
                  <Link
                    href={`/products/${p.id}/edit`}
                    className="inline-flex items-center gap-2 rounded-xl border-2 border-violet-200 bg-white px-4 py-2 text-sm font-semibold text-violet-600 hover:bg-violet-50 hover:border-violet-300 transition-all duration-200"
                  >
                    <Pencil className="h-4 w-4" />
                    Chỉnh sửa
                  </Link>
                  <DeleteProductButton id={p.id} />
                </>
              ) : (
                <>
                  <NeedsLoginButton
                    label="Chỉnh sửa"
                    className="inline-flex items-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all duration-200"
                    message="Bạn cần đăng nhập để chỉnh sửa sản phẩm."
                    goTo="/signin"
                  />
                  <NeedsLoginButton
                    label="Xóa"
                    className="inline-flex items-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all duration-200"
                    message="Bạn cần đăng nhập để xóa sản phẩm."
                    goTo="/signin"
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="mx-auto max-w-7xl px-4 py-8 md:py-12">
        {/* Grid layout */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left: Image */}
          <div className="space-y-4">
            {/* Main image */}
            <div className="group relative overflow-hidden rounded-3xl border-2 border-gray-200 bg-white shadow-xl">
              <div className="aspect-[4/5] bg-gradient-to-br from-gray-100 to-gray-200">
                {p.image ? (
                  <>
                    <SafeImage
                      src={p.image}
                      alt={p.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </>
                ) : (
                  <div className="h-full w-full grid place-items-center">
                    <div className="flex flex-col items-center text-gray-400">
                      <div className="p-6 rounded-2xl bg-gray-200/50 mb-3">
                        <ImageIcon className="h-16 w-16" />
                      </div>
                      <span className="text-sm font-medium">
                        Chưa có hình ảnh
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Badges */}
              <div className="absolute top-4 left-4 flex gap-2">
                {isNew && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-xs font-bold shadow-lg">
                    <Sparkles className="h-3 w-3" />
                    MỚI
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm border border-gray-200 text-gray-700 text-xs font-semibold shadow-sm">
                  <BadgeCheck className="h-3 w-3 text-green-600" />
                  Đã xác thực
                </span>
              </div>

              {/* Action buttons */}
              <div className="absolute top-4 right-4 flex gap-2">
                <button className="p-2.5 rounded-full bg-white/90 backdrop-blur-sm border border-gray-200 text-gray-700 hover:bg-white hover:text-red-500 transition-all duration-200 shadow-sm">
                  <Heart className="h-5 w-5" />
                </button>
                <button className="p-2.5 rounded-full bg-white/90 backdrop-blur-sm border border-gray-200 text-gray-700 hover:bg-white hover:text-violet-600 transition-all duration-200 shadow-sm">
                  <Share2 className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Image info */}
            <div className="flex items-center justify-between text-sm text-gray-600 px-2">
              <span className="inline-flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                Xem ảnh phóng to
              </span>
              <span>1 / 1</span>
            </div>
          </div>

          {/* Right: Details */}
          <div className="space-y-6">
            {/* Title & Price */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                {p.name}
              </h1>

              <div className="inline-flex items-baseline gap-3 px-6 py-4 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 shadow-2xl shadow-violet-500/30">
                <span className="text-white/90 text-sm font-medium">
                  Giá bán
                </span>
                <span className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                  {formatVND(Number(p.price))}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl border-2 border-gray-100 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Tag className="h-5 w-5 text-violet-600" />
                Mô tả sản phẩm
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {p.description || "Chưa có mô tả chi tiết cho sản phẩm này."}
              </p>
            </div>

            {/* Info cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl border-2 border-gray-100 p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <CalendarClock className="h-4 w-4 text-violet-600" />
                  <dt className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Ngày tạo
                  </dt>
                </div>
                <dd className="text-sm font-medium text-gray-900">
                  {new Date(p.createdAt).toLocaleDateString("vi-VN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </dd>
              </div>

              <div className="bg-white rounded-2xl border-2 border-gray-100 p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <RefreshCcw className="h-4 w-4 text-violet-600" />
                  <dt className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Cập nhật
                  </dt>
                </div>
                <dd className="text-sm font-medium text-gray-900">
                  {new Date(p.updatedAt).toLocaleDateString("vi-VN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </dd>
              </div>

              <div className="sm:col-span-2 bg-white rounded-2xl border-2 border-gray-100 p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck className="h-4 w-4 text-violet-600" />
                  <dt className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Mã sản phẩm
                  </dt>
                </div>
                <dd className="font-mono text-sm text-gray-900 break-all bg-gray-50 px-3 py-2 rounded-lg">
                  {p.id}
                </dd>
              </div>
            </div>

            {/* Actions - Desktop */}
            <div className="hidden md:flex gap-3">
              {isAuthed ? (
                <>
                  <Link
                    href={`/products/${p.id}/edit`}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border-2 border-violet-200 bg-white px-6 py-3 text-sm font-bold text-violet-600 hover:bg-violet-50 hover:border-violet-300 transition-all duration-200"
                  >
                    <Pencil className="h-5 w-5" />
                    Chỉnh sửa sản phẩm
                  </Link>
                  <DeleteProductButton id={p.id} />
                </>
              ) : (
                <>
                  <NeedsLoginButton
                    label="Chỉnh sửa sản phẩm"
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-6 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all duration-200"
                    message="Bạn cần đăng nhập để chỉnh sửa sản phẩm."
                    goTo="/signin"
                  />
                </>
              )}
            </div>

            {/* Warning */}
            {isAuthed && (
              <div className="hidden md:flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200">
                <Trash2 className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-red-900 mb-1">
                    Cảnh báo
                  </h4>
                  <p className="text-sm text-red-700">
                    Việc xóa sản phẩm là vĩnh viễn và không thể hoàn tác.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Actions */}
        <div className="md:hidden mt-8 space-y-3">
          {isAuthed ? (
            <>
              <Link
                href={`/products/${p.id}/edit`}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl border-2 border-violet-200 bg-white px-6 py-3 text-sm font-bold text-violet-600 hover:bg-violet-50 hover:border-violet-300 transition-all duration-200"
              >
                <Pencil className="h-5 w-5" />
                Chỉnh sửa sản phẩm
              </Link>
              <DeleteProductButton id={p.id} />
            </>
          ) : (
            <NeedsLoginButton
              label="Chỉnh sửa sản phẩm"
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-6 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all duration-200"
              message="Bạn cần đăng nhập để chỉnh sửa sản phẩm."
              goTo="/signin"
            />
          )}
        </div>
      </div>
    </div>
  );
}
