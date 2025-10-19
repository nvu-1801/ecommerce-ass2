// app/products/page.tsx
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

import type React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import SafeImage from "@/components/SafeImage";
import NeedsLoginButton from "@/components/NeedsLoginButton";
import { supabaseServer } from "@/lib/supabase/supabase-server";
import Footer from "@/components/Footer";
import {
  Search,
  Plus,
  Sparkles,
  ShoppingBag,
  TrendingUp,
  X,
  SlidersHorizontal,
  ChevronDown,
} from "lucide-react";
import type { Prisma } from "@prisma/client";

// ---- UI types (giá trị hiển thị) ----
type ProductCard = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string | null;
  createdAt: Date;
};

type SearchParams = {
  page?: string;
  q?: string;
  sort?: "newest" | "oldest" | "price-asc" | "price-desc" | "name";
  minPrice?: string;
  maxPrice?: string;
  dateFilter?: "all" | "today" | "week" | "month";
};

const toVND = (n: number) =>
  Number(n).toLocaleString("vi-VN", { style: "currency", currency: "VND" });

const PAGE_SIZE = 12;

export default async function ProductsPage(props: {
  searchParams: Promise<SearchParams>;
}) {
  try {
    const sp = await props.searchParams;

    const page = Math.max(1, Number(sp?.page ?? 1) || 1);
    const q = (sp?.q ?? "").trim();
    const sort = (sp?.sort as SearchParams["sort"]) ?? "newest";
    const minPriceRaw = sp?.minPrice?.trim();
    const maxPriceRaw = sp?.maxPrice?.trim();
    const minPrice =
      minPriceRaw !== undefined &&
      minPriceRaw !== "" &&
      isFinite(Number(minPriceRaw))
        ? Number(minPriceRaw)
        : undefined;
    const maxPrice =
      maxPriceRaw !== undefined &&
      maxPriceRaw !== "" &&
      isFinite(Number(maxPriceRaw))
        ? Number(maxPriceRaw)
        : undefined;
    const dateFilter = (sp?.dateFilter as SearchParams["dateFilter"]) ?? "all";

    // Build where clause
    const where: Prisma.ProductWhereInput = {};

// Search by name
    if (q) {
      where.name = { contains: q, mode: "insensitive" as const };
    }

    // Price filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    // Date filter
    if (dateFilter !== "all") {
      const now = new Date();
      let dateFrom: Date | undefined;

      if (dateFilter === "today") {
        dateFrom = new Date();
        dateFrom.setHours(0, 0, 0, 0);
      } else if (dateFilter === "week") {
        dateFrom = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      } else if (dateFilter === "month") {
        dateFrom = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      }
      if (dateFrom) where.createdAt = { gte: dateFrom };
    }

    // Build orderBy
    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" };
    switch (sort) {
      case "oldest":
        orderBy = { createdAt: "asc" };
        break;
      case "price-asc":
        orderBy = { price: "asc" };
        break;
      case "price-desc":
        orderBy = { price: "desc" };
        break;
      case "name":
        orderBy = { name: "asc" };
        break;
      default:
        orderBy = { createdAt: "desc" };
    }

    const [total, rows] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        orderBy,
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          image: true,
          createdAt: true,
        },
      }),
    ]);

    const data: ProductCard[] = rows.map((r) => ({
      ...r,
      price: Number(r.price),
    }));

    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

    const makeHref = (p: number) =>
      `/products?${new URLSearchParams({
        ...(q ? { q } : {}),
        ...(sort && sort !== "newest" ? { sort } : {}),
        ...(minPrice !== undefined ? { minPrice: String(minPrice) } : {}),
        ...(maxPrice !== undefined ? { maxPrice: String(maxPrice) } : {}),
        ...(dateFilter && dateFilter !== "all" ? { dateFilter } : {}),
        page: String(p),
      }).toString()}`;

    const hasActiveFilters =
      (q && q.length > 0) ||
      sort !== "newest" ||
      minPrice !== undefined ||
      maxPrice !== undefined ||
      dateFilter !== "all";

    // Auth check
    const sb = await supabaseServer();
    const {
      data: { user },
    } = await sb.auth.getUser();
    const isAuthed = !!user;

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50">
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Header */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 shadow-lg shadow-violet-500/30">
                <ShoppingBag className="h-6 w-6 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                  Sản phẩm thời trang
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <TrendingUp className="h-4 w-4 text-gray-500" />
                  <p className="text-gray-600 text-sm font-medium">
                    {total} sản phẩm
                    {q && (
                      <>
                        {" • "}
                        <span className="italic text-violet-600">
                          kết quả cho {"\""} {q}{"\""} 
                        </span>
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Toolbar: search + filters + actions */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
            <form action="/products" className="space-y-4">
              {/* Search bar */}
              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="q"
                    defaultValue={q}
                    placeholder="Tìm kiếm sản phẩm theo tên..."
                    className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 pl-12 pr-4 py-3 outline-none focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100 transition-all duration-200"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold hover:from-violet-700 hover:to-fuchsia-700 shadow-lg shadow-violet-500/30 hover:shadow-xl hover:shadow-violet-500/40 transition-all duration-200 hover:-translate-y-0.5"
                  >
                    Tìm kiếm
                  </button>
                  {(q || hasActiveFilters) && (
                    <Link
                      href="/products"
                      className="px-6 py-3 rounded-xl border-2 border-gray-200 bg-white text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 flex items-center gap-2"
                    >
                      <X className="h-4 w-4" />
                      Xóa bộ lọc
                    </Link>
                  )}
                  {isAuthed ? (
                    <Link
                      href="/products/new"
                      className="px-6 py-3 rounded-xl bg-black text-white font-semibold hover:bg-gray-900 shadow-lg shadow-black/10 hover:shadow-xl hover:shadow-black/20 transition-all duration-200 hover:-translate-y-0.5 flex items-center gap-2"
                    >
                      <Plus className="h-5 w-5" strokeWidth={2.5} />
                      <span className="hidden sm:inline">Thêm mới</span>
                    </Link>
                  ) : (
                    <NeedsLoginButton
                      label="Thêm mới"
                      className="px-6 py-3 rounded-xl bg-black text-white font-semibold hover:bg-gray-900 shadow-lg shadow-black/10 hover:shadow-xl hover:shadow-black/20 transition-all duration-200 flex items-center gap-2"
                      message="Bạn cần đăng nhập để tạo sản phẩm mới."
                      goTo="/signin"
                    />
                  )}
                </div>
              </div>

              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-4 border-t border-gray-100">
                {/* Sort */}
                <div className="relative">
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                    <SlidersHorizontal className="h-3.5 w-3.5" />
                    Sắp xếp
                  </label>
                  <div className="relative">
                    <select
                      name="sort"
                      defaultValue={sort}
                      className="w-full rounded-lg border-2 border-gray-200 bg-gray-50 px-3 py-2 pr-8 text-sm font-medium outline-none focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100 transition-all duration-200 appearance-none cursor-pointer"
                    >
                      <option value="newest">Mới nhất</option>
                      <option value="oldest">Cũ nhất</option>
                      <option value="price-asc">Giá thấp → cao</option>
                      <option value="price-desc">Giá cao → thấp</option>
                      <option value="name">Tên A → Z</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Min Price */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Giá từ (VND)
                  </label>
                  <input
                    type="number"
                    name="minPrice"
                    defaultValue={minPrice}
                    placeholder="0"
                    min="0"
                    step="1000"
                    className="w-full rounded-lg border-2 border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium outline-none focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100 transition-all duration-200"
                  />
                </div>

                {/* Max Price */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Giá đến (VND)
                  </label>
                  <input
                    type="number"
                    name="maxPrice"
                    defaultValue={maxPrice}
                    placeholder="Không giới hạn"
                    min="0"
                    step="1000"
                    className="w-full rounded-lg border-2 border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium outline-none focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100 transition-all duration-200"
                  />
                </div>

                {/* Date Filter */}
                <div className="relative">
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Ngày tạo
                  </label>
                  <div className="relative">
                    <select
                      name="dateFilter"
                      defaultValue={dateFilter}
                      className="w-full rounded-lg border-2 border-gray-200 bg-gray-50 px-3 py-2 pr-8 text-sm font-medium outline-none focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100 transition-all duration-200 appearance-none cursor-pointer"
                    >
                      <option value="all">Tất cả</option>
                      <option value="today">Hôm nay</option>
                      <option value="week">7 ngày qua</option>
                      <option value="month">30 ngày qua</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Active Filters tags */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <span className="text-sm font-semibold text-gray-700">
                Bộ lọc:
              </span>
              {q && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-50 border border-violet-200 text-violet-700 text-xs font-medium">
                  Từ khóa: “{q}”
                </span>
              )}
              {sort !== "newest" && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-50 border border-violet-200 text-violet-700 text-xs font-medium">
                  <SlidersHorizontal className="h-3 w-3" />
                  {sort === "oldest" && "Cũ nhất"}
                  {sort === "price-asc" && "Giá thấp → cao"}
                  {sort === "price-desc" && "Giá cao → thấp"}
                  {sort === "name" && "Tên A → Z"}
                </span>
              )}
              {minPrice !== undefined && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-50 border border-violet-200 text-violet-700 text-xs font-medium">
                  Từ {toVND(minPrice)}
                </span>
              )}
              {maxPrice !== undefined && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-50 border border-violet-200 text-violet-700 text-xs font-medium">
                  Đến {toVND(maxPrice)}
                </span>
              )}
              {dateFilter !== "all" && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-50 border border-violet-200 text-violet-700 text-xs font-medium">
                  {dateFilter === "today" && "Hôm nay"}
                  {dateFilter === "week" && "7 ngày qua"}
                  {dateFilter === "month" && "30 ngày qua"}
                </span>
              )}
            </div>
          )}

          {/* Empty state / Grid */}
          {data.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-16 text-center">
              <div className="inline-flex p-6 rounded-3xl bg-gradient-to-br from-violet-100 to-fuchsia-100 mb-6">
                <Sparkles className="h-12 w-12 text-violet-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Không tìm thấy sản phẩm
              </h2>
              <p className="text-gray-600 mb-8">
                {q || hasActiveFilters
                  ? "Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm."
                  : "Hãy tạo sản phẩm đầu tiên để bắt đầu bán hàng."}
              </p>
              <div className="flex justify-center gap-3">
                {(q || hasActiveFilters) && (
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-gray-200 bg-white text-gray-700 font-semibold hover:bg-gray-50 transition-all duration-200"
                  >
                    <X className="h-4 w-4" />
                    Xóa bộ lọc
                  </Link>
                )}
                {isAuthed ? (
                  <Link
                    href="/products/new"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold hover:from-violet-700 hover:to-fuchsia-700 shadow-lg shadow-violet-500/30 transition-all duration-200"
                  >
                    <Plus className="h-5 w-5" />
                    Tạo sản phẩm
                  </Link>
                ) : (
                  <NeedsLoginButton
                    label="Tạo sản phẩm"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold hover:from-violet-700 hover:to-fuchsia-700 shadow-lg shadow-violet-500/30 transition-all duration-200"
                    message="Bạn cần đăng nhập để tạo sản phẩm mới."
                    goTo="/signin"
                  />
                )}
              </div>
            </div>
          ) : (
            <>
              {/* Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {data.map((p) => (
                  <Link
                    key={p.id}
                    href={`/products/${p.id}`}
                    className="group relative overflow-hidden rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    {/* Image */}
                    <div className="aspect-[4/5] w-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 relative">
                      {p.image ? (
                        <>
                          <SafeImage
                            src={p.image}
                            alt={p.name}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </>
                      ) : (
                        <div className="h-full w-full grid place-items-center">
                          <div className="text-center">
                            <ShoppingBag className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                            <span className="text-sm text-gray-400 font-medium">
                              No Image
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Badge NEW (nếu mới tạo trong 7 ngày) */}
                      {new Date().getTime() - p.createdAt.getTime() <
                        7 * 24 * 60 * 60 * 1000 && (
                        <div className="absolute top-3 right-3">
                          <span className="px-3 py-1 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-xs font-bold shadow-lg">
                            MỚI
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Body */}
                    <div className="p-5">
                      <h3 className="text-base font-bold text-gray-900 line-clamp-1 mb-2 group-hover:text-violet-600 transition-colors">
                        {p.name}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-4 leading-relaxed">
                        {p.description || "Chưa có mô tả"}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                          {toVND(p.price)}
                        </span>
                        <span className="px-3 py-1.5 rounded-lg bg-violet-50 text-violet-600 text-xs font-semibold group-hover:bg-gradient-to-r group-hover:from-violet-600 group-hover:to-fuchsia-600 group-hover:text-white transition-all">
                          Xem chi tiết
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 flex items-center justify-center">
                  <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    makeHref={makeHref}
                  />
                </div>
              )}
            </>
          )}
        </div>
        <Footer />
      </div>
    );
  } catch (e) {
    console.error("ProductsPage error:", e);
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="bg-white rounded-2xl shadow-lg border border-red-200 p-8 max-w-md text-center">
          <div className="inline-flex p-4 rounded-full bg-red-100 mb-4">
            <X className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Lỗi kết nối database
          </h2>
          <p className="text-gray-600 mb-4">
            Không thể tải dữ liệu sản phẩm. Vui lòng kiểm tra lại.
          </p>
          <code className="text-sm bg-gray-100 px-3 py-1 rounded">
            /api/health
          </code>
        </div>
      </div>
    );
  }
}

/** ---------- Pagination ---------- */
function Pagination({
  currentPage,
  totalPages,
  makeHref,
}: {
  currentPage: number;
  totalPages: number;
  makeHref: (p: number) => string;
}) {
  const pages = getCompactPages(currentPage, totalPages);

  return (
    <nav
      className="inline-flex items-center gap-2 bg-white rounded-xl shadow-lg border border-gray-200 p-2"
      aria-label="Pagination"
    >
      <PageLink
        href={currentPage > 1 ? makeHref(currentPage - 1) : undefined}
        disabled={currentPage <= 1}
      >
        ← Trước
      </PageLink>

      {pages.map((p, i) =>
        typeof p === "number" ? (
          <PageLink
            key={i}
            href={makeHref(p)}
            active={p === currentPage}
            ariaCurrent={p === currentPage ? "page" : undefined}
          >
            {p}
          </PageLink>
        ) : (
          <span
            key={i}
            className="px-3 py-2 text-gray-400 select-none"
            aria-hidden
          >
            …
          </span>
        )
      )}

      <PageLink
        href={currentPage < totalPages ? makeHref(currentPage + 1) : undefined}
        disabled={currentPage >= totalPages}
      >
        Sau →
      </PageLink>
    </nav>
  );
}

function PageLink({
  href,
  children,
  active,
  disabled,
  ariaCurrent,
}: {
  href?: string;
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  ariaCurrent?: "page";
}) {
  const base =
    "min-w-10 text-center px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200";
  const styles = active
    ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/30"
    : disabled
    ? "text-gray-300 cursor-not-allowed"
    : "text-gray-700 hover:bg-gray-100";

  if (!href || disabled) {
    return (
      <span className={`${base} ${styles}`} aria-current={ariaCurrent}>
        {children}
      </span>
    );
  }
  return (
    <Link
      href={href}
      className={`${base} ${styles}`}
      aria-current={ariaCurrent}
      prefetch={false}
    >
      {children}
    </Link>
  );
}

function getCompactPages(current: number, total: number): (number | "…")[] {
  const delta = 1;
  const range: number[] = [];
  const rangeWithDots: (number | "…")[] = [];
  let l: number | undefined;

  for (let i = 1; i <= total; i++) {
    if (
      i === 1 ||
      i === total ||
      (i >= current - delta && i <= current + delta)
    ) {
      range.push(i);
    }
  }
  for (const i of range) {
    if (l) {
      if (i - l === 2) rangeWithDots.push(l + 1);
      else if (i - l > 2) rangeWithDots.push("…");
    }
    rangeWithDots.push(i);
    l = i;
  }
  return rangeWithDots;
}
