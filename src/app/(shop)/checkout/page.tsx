"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartProvider";
import SafeImage from "@/components/SafeImage";
import {
  MapPin,
  Truck,
  Tag,
  CreditCard,
  Check,
  AlertCircle,
  ShoppingBag,
  Sparkles,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

// Mock data
const ADDRESSES = [
  {
    id: "1",
    name: "Nhà riêng",
    fullName: "Nguyễn Văn A",
    phone: "0123456789",
    address: "123 Đường Lê Lợi, Phường Bến Nghé, Quận 1, TP.HCM",
    isDefault: true,
  },
];

const SHIPPING_OPTIONS = [
  {
    id: "standard",
    name: "Giao hàng tiêu chuẩn",
    description: "3-5 ngày làm việc",
    price: 30000,
    icon: Truck,
  },
  {
    id: "fast",
    name: "Giao hàng nhanh",
    description: "1-2 ngày làm việc",
    price: 50000,
    icon: Truck,
  },
];

const VOUCHERS = [
  {
    id: "welcome10",
    code: "WELCOME10",
    name: "Giảm 10% đơn đầu",
    discount: 10,
    type: "percentage" as const,
    minOrder: 500000,
    description: "Giảm 10% cho đơn hàng đầu tiên",
  },
  {
    id: "freeship",
    code: "FREESHIP",
    name: "Miễn phí vận chuyển",
    discount: 30000,
    type: "fixed" as const,
    minOrder: 300000,
    description: "Miễn phí vận chuyển cho đơn từ 300k",
  },
  {
    id: "save50k",
    code: "SAVE50K",
    name: "Giảm 50.000đ",
    discount: 50000,
    type: "fixed" as const,
    minOrder: 1000000,
    description: "Giảm 50k cho đơn từ 1 triệu",
  },
  {
    id: "vip20",
    code: "VIP20",
    name: "VIP giảm 20%",
    discount: 20,
    type: "percentage" as const,
    minOrder: 2000000,
    description: "Giảm 20% cho đơn từ 2 triệu",
  },
];

const PAYMENT_METHODS = [
  { id: "cod", name: "Thanh toán khi nhận hàng (COD)", icon: "💵" },
  { id: "momo", name: "Ví MoMo", icon: "📱" },
  { id: "banking", name: "Chuyển khoản ngân hàng", icon: "🏦" },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalAmount, clearCart } = useCart();

  const [selectedAddress, setSelectedAddress] = useState(
    ADDRESSES[0]?.id || ""
  );
  const [selectedShipping, setSelectedShipping] = useState(
    SHIPPING_OPTIONS[0].id
  );
  const [selectedVoucher, setSelectedVoucher] = useState<string | null>(null);
  const [selectedPayment, setSelectedPayment] = useState("cod");
  const [note, setNote] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const formatVND = (amount: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);

  // Check giỏ hàng trống
  if (items.length === 0) {
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
            Giỏ hàng trống
          </h2>
          <p className="text-gray-600 mb-6">
            Bạn chưa có sản phẩm nào trong giỏ hàng
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold hover:from-violet-700 hover:to-fuchsia-700 shadow-lg shadow-violet-500/30 transition-all duration-200"
          >
            <ArrowLeft className="h-4 w-4" />
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    );
  }

  // Tính toán discount
  const shippingOption = SHIPPING_OPTIONS.find(
    (s) => s.id === selectedShipping
  );
  const shippingFee = shippingOption?.price || 0;

  const calculateDiscount = () => {
    if (!selectedVoucher) return 0;

    const voucher = VOUCHERS.find((v) => v.id === selectedVoucher);
    if (!voucher || totalAmount < voucher.minOrder) return 0;

    if (voucher.type === "percentage") {
      const discountAmount = (totalAmount * voucher.discount) / 100;
      return Math.min(discountAmount, 500000); // Max 500k
    }
    return voucher.discount;
  };

  const discount = calculateDiscount();
  const finalTotal = totalAmount + shippingFee - discount;

  // ✅ Mock checkout - chỉ cần lưu vào localStorage và redirect
  const handleCheckout = async () => {
    setIsProcessing(true);

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Generate mock order
      const mockOrder = {
        id: `order_${Date.now()}`,
        orderNumber: `ORD${Date.now()}`,
        status: "PENDING",
        paymentStatus: selectedPayment === "cod" ? "UNPAID" : "PAID",
        paymentMethod: selectedPayment,
        shippingMethod: selectedShipping,
        total: finalTotal,
        subtotal: totalAmount,
        discount: discount,
        shippingFee: shippingFee,
        voucherCode: selectedVoucher || null,
        note: note || null,
        createdAt: new Date().toISOString(),
        items: items.map((item) => ({
          id: `item_${Date.now()}_${item.id}`,
          productId: item.id,
          productName: item.name,
          productImage: item.image,
          price: item.price,
          quantity: item.quantity,
          subtotal: item.price * item.quantity,
        })),
        address:
          ADDRESSES.find((a) => a.id === selectedAddress) || ADDRESSES[0],
      };

      // Save to localStorage (để page orders và success có thể đọc)
      const existingOrders = JSON.parse(
        localStorage.getItem("mock_orders") || "[]"
      );
      existingOrders.unshift(mockOrder);
      localStorage.setItem("mock_orders", JSON.stringify(existingOrders));

      // Clear cart
      await clearCart();

      // Redirect to success page
      router.push(`/checkout/success?orderId=${mockOrder.id}`);
    } catch (error) {
      console.error("Checkout error:", error);
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại giỏ hàng
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Thanh toán</h1>
          <p className="text-gray-600">Hoàn tất đơn hàng của bạn</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Address Section */}
            <div className="bg-white rounded-2xl border-2 border-gray-100 shadow-lg p-6">
              <h3 className="flex items-center gap-2 font-bold text-gray-900 mb-4">
                <MapPin className="h-5 w-5 text-violet-600" />
                Địa chỉ giao hàng
              </h3>
              <div className="space-y-3">
                {ADDRESSES.map((addr) => (
                  <label
                    key={addr.id}
                    className={`block p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedAddress === addr.id
                        ? "border-violet-500 bg-violet-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="address"
                      value={addr.id}
                      checked={selectedAddress === addr.id}
                      onChange={(e) => setSelectedAddress(e.target.value)}
                      className="sr-only"
                    />
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-gray-900">
                            {addr.name}
                          </span>
                          {addr.isDefault && (
                            <span className="px-2 py-0.5 text-xs font-semibold bg-violet-100 text-violet-600 rounded">
                              Mặc định
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          {addr.fullName} | {addr.phone}
                        </p>
                        <p className="text-sm text-gray-700">{addr.address}</p>
                      </div>
                      {selectedAddress === addr.id && (
                        <Check className="h-5 w-5 text-violet-600 flex-shrink-0" />
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Shipping Section */}
            <div className="bg-white rounded-2xl border-2 border-gray-100 shadow-lg p-6">
              <h3 className="flex items-center gap-2 font-bold text-gray-900 mb-4">
                <Truck className="h-5 w-5 text-violet-600" />
                Phương thức vận chuyển
              </h3>
              <div className="space-y-3">
                {SHIPPING_OPTIONS.map((shipping) => (
                  <label
                    key={shipping.id}
                    className={`block p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedShipping === shipping.id
                        ? "border-violet-500 bg-violet-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="shipping"
                      value={shipping.id}
                      checked={selectedShipping === shipping.id}
                      onChange={(e) => setSelectedShipping(e.target.value)}
                      className="sr-only"
                    />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <shipping.icon className="h-5 w-5 text-gray-400" />
                        <div>
                          <div className="font-semibold text-gray-900">
                            {shipping.name}
                          </div>
                          <div className="text-sm text-gray-600">
                            {shipping.description}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900">
                          {formatVND(shipping.price)}
                        </span>
                        {selectedShipping === shipping.id && (
                          <Check className="h-5 w-5 text-violet-600" />
                        )}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Voucher Section */}
            <div className="bg-white rounded-2xl border-2 border-gray-100 shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-violet-100 rounded-lg">
                  <Tag className="h-5 w-5 text-violet-600" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Mã giảm giá</h2>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                {VOUCHERS.map((v) => {
                  const isEligible = totalAmount >= v.minOrder;
                  const isSelected = selectedVoucher === v.id;

                  // Preview discount
                  let previewDiscount = 0;
                  if (v.type === "percentage") {
                    previewDiscount = Math.min(
                      (totalAmount * v.discount) / 100,
                      500000
                    );
                  } else {
                    previewDiscount = v.discount;
                  }

                  return (
                    <button
                      key={v.id}
                      onClick={() =>
                        isEligible &&
                        setSelectedVoucher(isSelected ? null : v.id)
                      }
                      disabled={!isEligible}
                      className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                        isSelected
                          ? "border-violet-500 bg-violet-50 shadow-lg shadow-violet-500/20"
                          : isEligible
                          ? "border-gray-200 hover:border-violet-300 hover:bg-gray-50"
                          : "border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed"
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute -top-2 -right-2 p-1 bg-violet-600 rounded-full shadow-lg">
                          <Check className="h-4 w-4 text-white" />
                        </div>
                      )}

                      <div className="flex items-center gap-2 mb-2">
                        <div className="px-2 py-1 bg-gradient-to-r from-violet-100 to-fuchsia-100 rounded-lg">
                          <span className="font-mono font-bold text-violet-600 text-xs">
                            {v.code}
                          </span>
                        </div>
                        {v.type === "percentage" && (
                          <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-bold rounded">
                            -{v.discount}%
                          </span>
                        )}
                      </div>

                      <div className="text-sm font-bold text-gray-900 mb-1">
                        {v.name}
                      </div>
                      <div className="text-xs text-gray-600 mb-2">
                        {v.description}
                      </div>

                      {isEligible && (
                        <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 mb-2">
                          <Sparkles className="h-3 w-3" />
                          <span>Tiết kiệm {formatVND(previewDiscount)}</span>
                        </div>
                      )}

                      {!isEligible && (
                        <>
                          <div className="flex items-center gap-1 text-xs text-red-600 bg-red-50 px-2 py-1 rounded mb-2">
                            <AlertCircle className="h-3 w-3 flex-shrink-0" />
                            <span>Đơn tối thiểu {formatVND(v.minOrder)}</span>
                          </div>
                          <div>
                            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-violet-400 to-fuchsia-400 transition-all duration-300"
                                style={{
                                  width: `${Math.min(
                                    (totalAmount / v.minOrder) * 100,
                                    100
                                  )}%`,
                                }}
                              />
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              Mua thêm {formatVND(v.minOrder - totalAmount)} để
                              dùng mã
                            </div>
                          </div>
                        </>
                      )}
                    </button>
                  );
                })}
              </div>

              {selectedVoucher && discount > 0 && (
                <div className="mt-4 p-4 bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-emerald-600" />
                      <div>
                        <div className="font-bold text-emerald-900 text-sm">
                          Mã giảm giá đã áp dụng
                        </div>
                        <div className="text-xs text-emerald-700">
                          {VOUCHERS.find((v) => v.id === selectedVoucher)?.name}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-emerald-700">Tiết kiệm</div>
                      <div className="text-lg font-bold text-emerald-600">
                        -{formatVND(discount)}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl border-2 border-gray-100 shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-violet-100 rounded-lg">
                  <CreditCard className="h-5 w-5 text-violet-600" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">
                  Phương thức thanh toán
                </h2>
              </div>

              <div className="space-y-3">
                {PAYMENT_METHODS.map((pm) => (
                  <label
                    key={pm.id}
                    className={`block p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedPayment === pm.id
                        ? "border-violet-500 bg-violet-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={pm.id}
                      checked={selectedPayment === pm.id}
                      onChange={(e) => setSelectedPayment(e.target.value)}
                      className="sr-only"
                    />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{pm.icon}</span>
                        <span className="font-semibold text-gray-900">
                          {pm.name}
                        </span>
                      </div>
                      {selectedPayment === pm.id && (
                        <Check className="h-5 w-5 text-violet-600" />
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Note Section */}
            <div className="bg-white rounded-2xl border-2 border-gray-100 shadow-lg p-6">
              <h3 className="font-bold text-gray-900 mb-4">Ghi chú đơn hàng</h3>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Ghi chú cho người bán..."
                rows={4}
                className="w-full p-4 rounded-xl border-2 border-gray-200 outline-none focus:border-violet-500 transition-colors resize-none"
              />
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Products */}
              <div className="bg-white rounded-2xl border-2 border-gray-100 shadow-lg p-6">
                <h3 className="font-bold text-gray-900 mb-4">
                  Sản phẩm ({items.length})
                </h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        {item.image ? (
                          <SafeImage
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full grid place-items-center">
                            <ShoppingBag className="h-6 w-6 text-gray-300" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-gray-900 line-clamp-1">
                          {item.name}
                        </h4>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-gray-600">
                            SL: {item.quantity}
                          </span>
                          <span className="text-sm font-bold text-gray-900">
                            {formatVND(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="bg-gradient-to-br from-violet-50 to-fuchsia-50 rounded-2xl border-2 border-violet-200 shadow-lg p-6">
                <h3 className="font-bold text-gray-900 mb-4">Tổng cộng</h3>

                <div className="space-y-3 mb-4 pb-4 border-b border-violet-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tạm tính</span>
                    <span className="font-semibold text-gray-900">
                      {formatVND(totalAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Phí vận chuyển</span>
                    <span className="font-semibold text-gray-900">
                      {formatVND(shippingFee)}
                    </span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <div className="flex items-center gap-1">
                        <Tag className="h-3 w-3 text-emerald-600" />
                        <span className="text-gray-600">Giảm giá</span>
                      </div>
                      <span className="font-bold text-emerald-600">
                        -{formatVND(discount)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg font-bold text-gray-900">
                    Tổng cộng
                  </span>
                  <div className="text-right">
                    {discount > 0 && (
                      <div className="text-sm text-gray-500 line-through">
                        {formatVND(totalAmount + shippingFee)}
                      </div>
                    )}
                    <span className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                      {formatVND(finalTotal)}
                    </span>
                  </div>
                </div>

                {discount > 0 && (
                  <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-emerald-700">
                      <Sparkles className="h-4 w-4" />
                      <span className="font-semibold">
                        Bạn đã tiết kiệm được {formatVND(discount)}!
                      </span>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleCheckout}
                  disabled={isProcessing || !selectedAddress}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold shadow-lg shadow-violet-500/30 hover:shadow-xl hover:shadow-violet-500/40 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isProcessing ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Đang xử lý...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Sparkles className="h-5 w-5" />
                      Đặt hàng {formatVND(finalTotal)}
                    </span>
                  )}
                </button>

                <p className="text-xs text-center text-gray-600 mt-4">
                  Bằng việc đặt hàng, bạn đồng ý với{" "}
                  <a href="#" className="text-violet-600 hover:underline">
                    Điều khoản dịch vụ
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
