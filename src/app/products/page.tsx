// app/products/page.tsx
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import SafeImage from "@/components/SafeImage";
import NeedsLoginButton from "@/components/NeedsLoginButton";
import { supabaseServer } from "@/lib/supabase/supabase-server";
import Footer from "@/components/Footer";

// ---- UI types (giá trị hiển thị) ----
type ProductCard = {
  id: string;
  name: string;
  description: string;
  price: number; // number cho UI
  image: string | null;
  createdAt: Date;
};

type SearchParams = { page?: string; q?: string };

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

    const where = q
      ? { name: { contains: q, mode: "insensitive" as const } }
      : undefined;

    const [total, rows] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        orderBy: { createdAt: "desc" },
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
        page: String(p),
      }).toString()}`;

    // ✅ Kiểm tra đăng nhập (server-side)
    const sb = await supabaseServer();
    const {
      data: { user },
    } = await sb.auth.getUser();
    const isAuthed = !!user;

    return (
      <div className="min-h-[calc(100vh-56px)] bg-gradient-to-b from-indigo-50 via-white to-fuchsia-50">
        <div className="max-w-6xl mx-auto px-5 py-10">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight bg-gradient-to-r from-indigo-600 to-fuchsia-600 bg-clip-text text-transparent">
                Products
              </h1>
              <p className="text-zinc-600 mt-1">
                {total} item{total !== 1 ? "s" : ""} • clothing catalog
                {q && (
                  <>
                    {" "}
                    • <span className="italic">search: “{q}”</span>
                  </>
                )}
              </p>
            </div>

            {/* New Product: cần login */}
            {isAuthed ? (
              <Link
                href="/products/new"
                className="inline-flex items-center gap-2 rounded-xl bg-black text-white px-4 py-2 shadow-lg shadow-black/10 hover:shadow-black/20 transition-shadow"
              >
                <span aria-hidden>＋</span>
                New Product
              </Link>
            ) : (
              <NeedsLoginButton
                label="New Product"
                className="inline-flex items-center gap-2 rounded-xl bg-black text-white px-4 py-2 shadow-lg shadow-black/10 hover:shadow-black/20 transition-shadow"
                message="Bạn cần đăng nhập để tạo sản phẩm mới."
                goTo="/signin"
              />
            )}
          </div>

          {/* Toolbar: search + summary */}
          <div className="mb-8">
            <form
              action="/products"
              className="flex flex-col sm:flex-row gap-3"
            >
              <input
                type="text"
                name="q"
                defaultValue={q}
                placeholder="Tìm theo tên sản phẩm…"
                className="w-full rounded-xl border border-zinc-300 bg-white/80 px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="rounded-xl border border-zinc-300 bg-white px-4 py-2 hover:bg-zinc-50"
                >
                  Search
                </button>
                {q && (
                  <Link
                    href="/products"
                    className="rounded-xl border border-zinc-300 bg-white px-4 py-2 hover:bg-zinc-50"
                  >
                    Clear
                  </Link>
                )}
              </div>
            </form>
          </div>

          {/* Empty state */}
          {data.length === 0 ? (
            <div className="border rounded-2xl p-10 text-center bg-white/80">
              <p className="text-zinc-800 text-lg font-medium">
                No products found
              </p>
              <p className="text-zinc-500 mt-1">
                {q
                  ? "Thử từ khóa khác, hoặc xóa bộ lọc."
                  : "Tạo sản phẩm đầu tiên để bắt đầu."}
              </p>
              <div className="mt-6 flex justify-center gap-3">
                {isAuthed ? (
                  <Link
                    href="/products/new"
                    className="inline-block rounded-lg border px-4 py-2 hover:bg-zinc-50"
                  >
                    Create product
                  </Link>
                ) : (
                  <NeedsLoginButton
                    label="Create product"
                    className="inline-block rounded-lg border px-4 py-2 hover:bg-zinc-50"
                    message="Bạn cần đăng nhập để tạo sản phẩm mới."
                    goTo="/signin"
                  />
                )}
                {q && (
                  <Link
                    href="/products"
                    className="inline-block rounded-lg border px-4 py-2 hover:bg-zinc-50"
                  >
                    Clear search
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <>
              {/* Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.map((p) => (
                  <Link
                    key={p.id}
                    href={`/products/${p.id}`}
                    className="group relative overflow-hidden rounded-2xl border bg-white transition-all hover:-translate-y-0.5 hover:shadow-xl"
                  >
                    {/* Image */}
                    <div className="aspect-[4/5] w-full overflow-hidden bg-gradient-to-tr from-zinc-100 to-zinc-200">
                      {p.image ? (
                        <SafeImage
                          src={p.image}
                          alt={p.name}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        />
                      ) : (
                        <div className="h-full w-full grid place-items-center text-zinc-400">
                          No Image
                        </div>
                      )}
                    </div>

                    {/* Body */}
                    <div className="p-4">
                      <h3 className="text-base text-gray-800 font-semibold line-clamp-1">
                        {p.name}
                      </h3>
                      <p className="mt-1 text-sm text-zinc-600 line-clamp-2">
                        {p.description}
                      </p>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-[15px] text-gray-800 font-medium">
                          {toVND(p.price)}
                        </span>
                        <span className="rounded-full border px-2 py-0.5 text-xs text-zinc-600 bg-zinc-50">
                          View
                        </span>
                      </div>
                    </div>

                    <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-black/5 via-transparent to-transparent" />
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              <div className="mt-10 flex items-center justify-center gap-2">
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  makeHref={makeHref}
                />
              </div>
            </>
          )}
        </div>
        <Footer />
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

/** ---------- Pagination (giữ nguyên) ---------- */
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
    <nav className="inline-flex items-center gap-1" aria-label="Pagination">
      <PageLink
        href={currentPage > 1 ? makeHref(currentPage - 1) : undefined}
        disabled={currentPage <= 1}
      >
        ‹ Prev
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
            className="px-3 py-2 text-zinc-400 select-none"
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
        Next ›
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
    "min-w-10 text-center px-3 py-2 rounded-xl border transition-all";
  const styles = active
    ? "bg-black text-white border-black"
    : disabled
    ? "text-zinc-400 border-zinc-200 cursor-not-allowed"
    : "bg-white border-zinc-200 hover:bg-zinc-50";

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
