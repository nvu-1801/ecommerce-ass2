// src/app/(shop)/orders/success/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { getOrderById } from "@/app/actions/order/getOrderById";
import {
  CheckCircle,
  Package,
  ArrowRight,
  Loader2,
  XCircle,
} from "lucide-react";

// ✅ Type cho Order
type Order = {
  id: string;
  orderNumber: string;
  total: number;
  status: string;
  paymentStatus: string;
  createdAt: Date | string;
};

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadOrder() {
      if (!orderId) {
        setError("Không tìm thấy mã đơn hàng");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // TODO: Lấy userId thật từ auth session
        const userId = "temp-user-id";
        const data = await getOrderById(orderId, userId);

        if (!data) {
          setError("Không tìm thấy đơn hàng");
        } else {
          setOrder(data);
        }
      } catch (err) {
        console.error("Load order error:", err);
        setError("Đã có lỗi xảy ra khi tải đơn hàng");
      } finally {
        setIsLoading(false);
      }
    }

    loadOrder();
  }, [orderId]);

  const formatVND = (amount: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);

  // ✅ Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="h-16 w-16 text-violet-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Đang tải thông tin đơn hàng...</p>
        </div>
      </div>
    );
  }

  // ✅ Error state
  if (error || !order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="bg-white rounded-3xl border-2 border-gray-100 shadow-2xl p-8 text-center">
            <div className="inline-flex p-6 bg-red-100 rounded-full mb-6">
              <XCircle className="h-16 w-16 text-red-600" strokeWidth={2} />
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              Đã có lỗi xảy ra
            </h1>
            <p className="text-gray-600 mb-6">
              {error || "Không thể tải thông tin đơn hàng"}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/orders"
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold shadow-lg shadow-violet-500/30 hover:shadow-xl transition-all"
              >
                <Package className="h-5 w-5" />
                Xem đơn hàng
              </Link>
              <Link
                href="/products"
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl border-2 border-gray-300 text-gray-700 font-bold hover:bg-gray-50 transition-all"
              >
                Tiếp tục mua sắm
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ✅ Success state
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-3xl border-2 border-gray-100 shadow-2xl p-8 text-center">
          {/* Success Icon with Animation */}
          <div className="inline-flex p-6 bg-gradient-to-br from-emerald-100 to-green-100 rounded-full mb-6 animate-bounce">
            <CheckCircle
              className="h-16 w-16 text-emerald-600"
              strokeWidth={2}
            />
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Đặt hàng thành công!
          </h1>
          <p className="text-gray-600 mb-6">
            Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đang được xử lý.
          </p>

          {/* Order Info Card */}
          <div className="bg-gradient-to-br from-violet-50 to-fuchsia-50 rounded-2xl p-6 mb-6 border-2 border-violet-100">
            <div className="space-y-4">
              {/* Order Number */}
              <div className="flex items-center justify-between p-3 bg-white rounded-xl">
                <span className="text-sm font-semibold text-gray-600">
                  Mã đơn hàng
                </span>
                <span className="font-mono font-bold text-gray-900">
                  {order.orderNumber}
                </span>
              </div>

              {/* Total */}
              <div className="flex items-center justify-between p-3 bg-white rounded-xl">
                <span className="text-sm font-semibold text-gray-600">
                  Tổng tiền
                </span>
                <span className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                  {formatVND(order.total)}
                </span>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between p-3 bg-white rounded-xl">
                <span className="text-sm font-semibold text-gray-600">
                  Trạng thái
                </span>
                <span className="px-3 py-1 bg-amber-100 text-amber-700 text-sm font-bold rounded-lg">
                  Đang xử lý
                </span>
              </div>

              {/* Payment Status */}
              <div className="flex items-center justify-between p-3 bg-white rounded-xl">
                <span className="text-sm font-semibold text-gray-600">
                  Thanh toán
                </span>
                <span
                  className={`px-3 py-1 text-sm font-bold rounded-lg ${
                    order.paymentStatus === "PAID"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {order.paymentStatus === "PAID"
                    ? "Đã thanh toán"
                    : "Chưa thanh toán"}
                </span>
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-6 text-left">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                <Package className="h-5 w-5 text-blue-600" />
              </div>
              <div className="text-sm text-blue-900">
                <p className="font-semibold mb-1">Thông tin quan trọng:</p>
                <ul className="list-disc list-inside space-y-1 text-blue-800">
                  <li>Đơn hàng đã được ghi nhận vào hệ thống</li>
                  <li>Chúng tôi sẽ liên hệ xác nhận trong 24h</li>
                  <li>Bạn có thể theo dõi đơn hàng bên dưới</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href={`/orders/${orderId}`}
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold shadow-lg shadow-violet-500/30 hover:shadow-xl hover:shadow-violet-500/40 hover:-translate-y-0.5 transition-all duration-200"
            >
              <Package className="h-5 w-5" />
              Xem chi tiết đơn hàng
            </Link>
            <Link
              href="/products"
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl border-2 border-gray-300 text-gray-700 font-bold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
            >
              Tiếp tục mua sắm
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>

          {/* Secondary Link */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <Link
              href="/orders"
              className="text-sm text-violet-600 hover:text-violet-700 font-semibold hover:underline transition-colors"
            >
              Xem tất cả đơn hàng của tôi →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
