"use client";

import Link from "next/link";
import Carousel from "./Carousel";
import SafeImage from "./SafeImage";

export type ProductCard = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string | null;
  createdAt: Date | string;
};

const toVND = (n: number) =>
  Number(n).toLocaleString("vi-VN", { style: "currency", currency: "VND" });

export default function ProductCarousel({
  items,
  title = "Featured",
  subtitle,
}: {
  items: ProductCard[];
  title?: string;
  subtitle?: string;
}) {
  if (!items?.length) return null;

  return (
    <section className="mb-10">
      <div className="mb-4 flex items-end justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
          {subtitle && <p className="text-sm text-zinc-600">{subtitle}</p>}
        </div>
        <Link
          href="/products"
          className="text-sm text-indigo-600 hover:underline"
        >
          View all →
        </Link>
      </div>

      <Carousel
        itemWidthClass="min-w-[82%] sm:min-w-[48%] lg:min-w-[32%]"
        gapClass="gap-4"
        autoplay
        intervalMs={3800}
        visibleCountApprox={3}
      >
        {items.map((p) => (
          <Link
            key={p.id}
            href={`/products/${p.id}`}
            className="group block overflow-hidden rounded-2xl border bg-white hover:shadow-lg transition-shadow"
          >
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
            <div className="p-4">
              <h3 className="text-base font-semibold line-clamp-1 text-gray-800">
                {p.name}
              </h3>
              <p className="mt-1 text-sm text-zinc-600 line-clamp-2">
                {p.description}
              </p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-[15px] font-medium text-gray-800">
                  {toVND(Number(p.price))}
                </span>
                <span className="rounded-full border px-2 py-0.5 text-xs text-zinc-600 bg-zinc-50">
                  View
                </span>
              </div>
            </div>
          </Link>
        ))}
      </Carousel>
    </section>
  );
}
