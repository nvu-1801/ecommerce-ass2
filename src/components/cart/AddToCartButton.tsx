"use client";

import { ShoppingCart, Check } from "lucide-react";
import { useCart } from "@/context/CartProvider";
import { useState } from "react";

export default function AddToCartButton({
  product,
  className = "",
  variant = "default",
}: {
  product: {
    id: string;
    name: string;
    price: number;
    image?: string | null;
  };
  className?: string;
  variant?: "default" | "small" | "large";
}) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const variants = {
    small: "px-3 py-2 text-xs gap-1.5",
    default: "px-5 py-3 text-sm gap-2",
    large: "px-8 py-4 text-base gap-3",
  };

  const iconSizes = {
    small: 14,
    default: 18,
    large: 20,
  };

  return (
    <button
      onClick={handleAdd}
      disabled={added}
      className={`
        inline-flex items-center justify-center rounded-xl font-bold transition-all duration-200
        ${
          added
            ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
            : "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white hover:from-violet-700 hover:to-fuchsia-700 shadow-lg shadow-violet-500/30 hover:shadow-xl hover:shadow-violet-500/40 hover:-translate-y-0.5"
        }
        ${variants[variant]}
        ${className}
      `}
      aria-label="Add to cart"
    >
      {added ? (
        <>
          <Check size={iconSizes[variant]} strokeWidth={2.5} />
          <span>Đã thêm</span>
        </>
      ) : (
        <>
          <ShoppingCart size={iconSizes[variant]} strokeWidth={2.5} />
          <span>Thêm vào giỏ</span>
        </>
      )}
    </button>
  );
}
