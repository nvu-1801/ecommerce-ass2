import Link from "next/link";
import SafeImage from "@/components/SafeImage";
import AddToCartButton from "@/components/cart/AddToCartButton";
import { ShoppingBag } from "lucide-react";

export default function ProductCard({
  p,
  toVND,
}: {
  p: {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string | null;
    createdAt: Date;
  };
  toVND: (n: number) => string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <Link href={`/products/${p.id}`}>
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

          {new Date().getTime() - p.createdAt.getTime() <
            7 * 24 * 60 * 60 * 1000 && (
            <div className="absolute top-3 right-3">
              <span className="px-3 py-1 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-xs font-bold shadow-lg">
                MỚI
              </span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-5">
        <Link href={`/products/${p.id}`}>
          <h3 className="text-base font-bold text-gray-900 line-clamp-1 mb-2 group-hover:text-violet-600 transition-colors">
            {p.name}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2 mb-4 leading-relaxed">
            {p.description || "Chưa có mô tả"}
          </p>
        </Link>

        <div className="flex items-center justify-between mb-3">
          <span className="text-lg font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
            {toVND(p.price)}
          </span>
        </div>

        {/* Add to Cart Button */}
        <AddToCartButton
          product={{
            id: p.id,
            name: p.name,
            price: p.price,
            image: p.image,
          }}
          variant="small"
          className="w-full"
        />
      </div>
    </div>
  );
}
