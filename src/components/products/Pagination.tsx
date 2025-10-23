import Link from "next/link";
import type React from "react";

export default function Pagination({
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
