// app/orders/page.tsx
"use client";

import SafeImage from "@/components/SafeImage";
import {
  ArrowRight,
  Calendar,
  CheckCircle,
  Clock,
  Filter,
  MapPin,
  Package,
  Search,
  ShoppingBag,
  Truck,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPING"
  | "DELIVERED"
  | "COMPLETED"
  | "CANCELLED"
  | "REFUNDED";

const STATUS_CONFIG: Record<
  OrderStatus,
  {
    label: string;
    color: string;
    bgColor: string;
    icon: React.ComponentType<{ className?: string }>;
  }
> = {
  PENDING: {
    label: "Chờ xác nhận",
    color: "text-amber-700",
    bgColor: "bg-amber-50 border-amber-200",
    icon: Clock,
  },
  CONFIRMED: {
    label: "Đã xác nhận",
    color: "text-blue-700",
    bgColor: "bg-blue-50 border-blue-200",
    icon: CheckCircle,
  },
  PROCESSING: {
    label: "Đang xử lý",
    color: "text-indigo-700",
    bgColor: "bg-indigo-50 border-indigo-200",
    icon: Package,
  },
  SHIPPING: {
    label: "Đang giao",
    color: "text-violet-700",
    bgColor: "bg-violet-50 border-violet-200",
    icon: Truck,
  },
  DELIVERED: {
    label: "Đã giao",
    color: "text-emerald-700",
    bgColor: "bg-emerald-50 border-emerald-200",
    icon: CheckCircle,
  },
  COMPLETED: {
    label: "Hoàn thành",
    color: "text-green-700",
    bgColor: "bg-green-50 border-green-200",
    icon: CheckCircle,
  },
  CANCELLED: {
    label: "Đã hủy",
    color: "text-red-700",
    bgColor: "bg-red-50 border-red-200",
    icon: XCircle,
  },
  REFUNDED: {
    label: "Đã hoàn tiền",
    color: "text-gray-700",
    bgColor: "bg-gray-50 border-gray-200",
    icon: XCircle,
  },
};

// ✅ Complete Order type
type Order = {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: string;
  paymentMethod: string;
  shippingMethod: string;
  total: number;
  subtotal: number;
  discount: number;
  shippingFee: number;
  voucherCode: string | null;
  note: string | null;
  createdAt: Date | string;
  items: Array<{
    id: string;
    productId: string;
    productName: string;
    productImage: string | null;
    quantity: number;
    price: number;
    subtotal: number;
  }>;
  address: {
    id: string;
    name: string;
    fullName: string;
    phone: string;
    address: string;
  };
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<OrderStatus | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // ✅ Load orders from localStorage
    const loadOrders = () => {
      setIsLoading(true);
      try {
        const mockOrders = JSON.parse(
          localStorage.getItem("mock_orders") || "[]"
        );

        // Convert string dates to Date objects
        const ordersWithDates = mockOrders.map((order: any) => ({
          ...order,
          createdAt: new Date(order.createdAt),
        }));

        setOrders(ordersWithDates);
      } catch (error) {
        console.error("Load orders error:", error);
        setOrders([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();

    // ✅ Listen for storage changes (when new order is created)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "mock_orders") {
        loadOrders();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Also listen for custom event (same tab)
    const handleCustomEvent = () => {
      loadOrders();
    };
    window.addEventListener("ordersUpdated", handleCustomEvent);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("ordersUpdated", handleCustomEvent);
    };
  }, []);

  const formatVND = (amount: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(dateObj);
  };

  const filteredOrders = orders.filter((order) => {
    const matchesFilter = filter === "ALL" || order.status === filter;
    const matchesSearch = order.orderNumber
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // ✅ Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Đang tải đơn hàng...</p>
        </div>
      </div>
    );
  }

  // ✅ Empty state
  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="inline-flex p-6 bg-gradient-to-br from-violet-100 to-fuchsia-100 rounded-3xl mb-6">
            <ShoppingBag
              className="h-16 w-16 text-violet-600"
              strokeWidth={1.5}
            />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Chưa có đơn hàng
          </h2>
          <p className="text-gray-600 mb-6">
            Bạn chưa có đơn hàng nào. Hãy bắt đầu mua sắm ngay!
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold hover:from-violet-700 hover:to-fuchsia-700 shadow-lg shadow-violet-500/30 transition-all duration-200"
          >
            <ShoppingBag className="h-4 w-4" />
            Khám phá sản phẩm
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Đơn hàng của tôi
          </h1>
          <p className="text-gray-600">
            Theo dõi và quản lý đơn hàng của bạn ({orders.length} đơn)
          </p>
        </div>

        {/* Filters & Search */}
        <div className="bg-white rounded-2xl border-2 border-gray-100 shadow-lg p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo mã đơn hàng..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 outline-none focus:border-violet-500 transition-colors"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0">
              <Filter className="h-5 w-5 text-gray-400 flex-shrink-0" />
              <button
                onClick={() => setFilter("ALL")}
                className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-all ${
                  filter === "ALL"
                    ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Tất cả
              </button>
              {(
                [
                  "PENDING",
                  "SHIPPING",
                  "DELIVERED",
                  "CANCELLED",
                ] as OrderStatus[]
              ).map((status) => {
                const config = STATUS_CONFIG[status];
                return (
                  <button
                    key={status}
                    onClick={() => setFilter(status)}
                    className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-all ${
                      filter === status
                        ? `${config.bgColor} ${config.color} border-2`
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {config.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl border-2 border-gray-100 shadow-lg p-12 text-center">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Không tìm thấy đơn hàng
            </h3>
            <p className="text-gray-600">
              Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => {
              const statusConfig = STATUS_CONFIG[order.status];
              const StatusIcon = statusConfig.icon;

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl border-2 border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  {/* Header */}
                  <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div
                          className={`p-3 ${statusConfig.bgColor} rounded-xl border-2`}
                        >
                          <StatusIcon
                            className={`h-6 w-6 ${statusConfig.color}`}
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <span className="font-mono font-bold text-gray-900">
                              {order.orderNumber}
                            </span>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-bold ${statusConfig.bgColor} ${statusConfig.color} border-2`}
                            >
                              {statusConfig.label}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(order.createdAt)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-sm text-gray-600 mb-1">
                          Tổng tiền
                        </div>
                        <div className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                          {formatVND(order.total)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Products */}
                  <div className="p-6 border-b border-gray-100">
                    <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Package className="h-5 w-5 text-violet-600" />
                      Sản phẩm ({order.items.length})
                    </h4>
                    <div className="space-y-3">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex gap-4 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                        >
                          <div className="w-16 h-16 rounded-lg overflow-hidden bg-white flex-shrink-0 border-2 border-gray-200">
                            {item.productImage ? (
                              <SafeImage
                                src={item.productImage}
                                alt={item.productName}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full grid place-items-center">
                                <ShoppingBag className="h-6 w-6 text-gray-300" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="font-semibold text-gray-900 line-clamp-1 mb-1">
                              {item.productName}
                            </h5>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">
                                SL: {item.quantity}
                              </span>
                              <span className="font-bold text-gray-900">
                                {formatVND(item.price * item.quantity)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Address */}
                  <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-violet-50/30 to-fuchsia-50/30">
                    <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-violet-600" />
                      Địa chỉ giao hàng
                    </h4>
                    <div className="bg-white rounded-xl p-4 border-2 border-violet-100">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-violet-100 rounded-lg">
                          <MapPin className="h-5 w-5 text-violet-600" />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 mb-1">
                            {order.address.name} - {order.address.fullName}
                          </div>
                          <p className="text-sm text-gray-600">
                            {order.address.address}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-6 bg-gray-50">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Link
                        href={`/orders/${order.id}`}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold shadow-lg shadow-violet-500/30 hover:shadow-xl hover:shadow-violet-500/40 hover:-translate-y-0.5 transition-all duration-200"
                      >
                        Xem chi tiết
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                      {order.status === "DELIVERED" && (
                        <button className="flex-1 px-4 py-3 rounded-xl border-2 border-emerald-300 bg-emerald-50 text-emerald-700 font-semibold hover:bg-emerald-100 transition-colors">
                          Đánh giá
                        </button>
                      )}
                      {order.status === "PENDING" && (
                        <button className="flex-1 px-4 py-3 rounded-xl border-2 border-red-300 bg-red-50 text-red-700 font-semibold hover:bg-red-100 transition-colors">
                          Hủy đơn
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination (nếu cần) */}
        {filteredOrders.length > 0 && (
          <div className="mt-8 flex justify-center">
            <div className="flex items-center gap-2">
              <button className="px-4 py-2 rounded-lg border-2 border-gray-300 text-gray-600 font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                Trước
              </button>
              <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold">
                1
              </button>
              <button className="px-4 py-2 rounded-lg border-2 border-gray-300 text-gray-600 font-semibold hover:bg-gray-100 transition-colors">
                2
              </button>
              <button className="px-4 py-2 rounded-lg border-2 border-gray-300 text-gray-600 font-semibold hover:bg-gray-100 transition-colors">
                3
              </button>
              <button className="px-4 py-2 rounded-lg border-2 border-gray-300 text-gray-600 font-semibold hover:bg-gray-100 transition-colors">
                Sau
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
