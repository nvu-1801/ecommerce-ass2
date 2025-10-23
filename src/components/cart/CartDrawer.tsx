// src/components/cart/CartDrawer.tsx
"use client";

import { useCart } from "@/context/CartProvider";
import SafeImage from "@/components/SafeImage";
import { X, ShoppingBag, Trash2, Plus, Minus, Loader2 } from "lucide-react";
import Link from "next/link";

export default function CartDrawer() {
  const {
    items,
    totalItems,
    totalAmount,
    isOpen,
    isLoading,
    closeCart,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();

  const formatVND = (amount: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-violet-50 to-fuchsia-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-violet-100 rounded-lg">
              <ShoppingBag className="h-6 w-6 text-violet-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Giỏ hàng</h2>
              <p className="text-sm text-gray-600">{totalItems} sản phẩm</p>
            </div>
          </div>
          <button
            onClick={closeCart}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="h-8 w-8 text-violet-600 animate-spin" />
          </div>
        )}

        {/* Empty State */}
        {!isLoading && items.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center p-8">
            <div className="p-6 bg-gray-100 rounded-full mb-4">
              <ShoppingBag className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Giỏ hàng trống
            </h3>
            <p className="text-gray-600 text-center mb-6">
              Thêm sản phẩm vào giỏ hàng để tiếp tục
            </p>
            <Link
              href="/products"
              onClick={closeCart}
              className="px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              Khám phá sản phẩm
            </Link>
          </div>
        )}

        {/* Cart Items */}
        {!isLoading && items.length > 0 && (
          <>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.map((item) => (
                <div
                  key={item.cartItemId || item.id}
                  className="flex gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  {/* Image */}
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-white flex-shrink-0">
                    {item.image ? (
                      <SafeImage
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full grid place-items-center">
                        <ShoppingBag className="h-8 w-8 text-gray-300" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">
                      {item.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-violet-600">
                        {formatVND(item.price)}
                      </span>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            item.cartItemId &&
                            updateQuantity(item.cartItemId, item.quantity - 1)
                          }
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                          disabled={!item.cartItemId}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            item.cartItemId &&
                            updateQuantity(item.cartItemId, item.quantity + 1)
                          }
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                          disabled={!item.cartItemId}
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Subtotal & Remove */}
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm text-gray-600">
                        Tổng: {formatVND(item.price * item.quantity)}
                      </span>
                      <button
                        onClick={() => item.cartItemId && removeItem(item.cartItemId)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                        disabled={!item.cartItemId}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 p-6 bg-gradient-to-r from-violet-50 to-fuchsia-50">
              {/* Clear Cart */}
              <button
                onClick={clearCart}
                className="w-full mb-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-semibold"
              >
                Xóa toàn bộ giỏ hàng
              </button>

              {/* Total */}
              <div className="flex items-center justify-between mb-4 p-4 bg-white rounded-xl">
                <span className="text-lg font-bold text-gray-900">Tổng cộng</span>
                <span className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                  {formatVND(totalAmount)}
                </span>
              </div>

              {/* Checkout Button */}
              <Link
                href="/checkout"
                onClick={closeCart}
                className="block w-full py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-center font-bold rounded-xl shadow-lg shadow-violet-500/30 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
              >
                Thanh toán
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  );
}