"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartProvider";

export default function CartButton() {
  const { totalItems, openCart } = useCart();

  return (
    <button
      onClick={openCart}
      className="relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:text-violet-600 hover:bg-violet-50 border border-gray-200 hover:border-violet-300 transition-all duration-200 group"
      aria-label="Open cart"
    >
      <ShoppingCart
        size={18}
        className="group-hover:scale-110 transition-transform"
        strokeWidth={2.5}
      />
      <span className="hidden sm:inline">Giỏ hàng</span>

      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-xs font-bold flex items-center justify-center shadow-lg animate-bounce">
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      )}
    </button>
  );
}
