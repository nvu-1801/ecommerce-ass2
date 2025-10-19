"use client";

import React from "react";
import Link from "next/link";
import {
  Mail,
  ArrowUp,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  MapPin,
  Phone,
  Clock,
  Globe,
  CreditCard,
  ShoppingBag,
  Sparkles,
  Heart,
  TrendingUp,
} from "lucide-react";

export default function Footer({ brand = "ShopStyle" }: { brand?: string }) {
  const [email, setEmail] = React.useState("");
  const [message, setMessage] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const year = new Date().getFullYear();

  function validateEmail(v: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  async function onSubscribe(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setError(null);
    if (!validateEmail(email)) {
      setError("Email không hợp lệ");
      return;
    }
    try {
      setMessage("🎉 Đăng ký thành công! Chào mừng bạn đến với ShopStyle");
      setEmail("");
    } catch {
      setError("Có lỗi xảy ra. Vui lòng thử lại.");
    }
  }

  function scrollToTop() {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  const sections: { title: string; links: { label: string; href: string }[] }[] = [
    {
      title: "Khám phá",
      links: [
        { label: "Sản phẩm mới", href: "/new" },
        { label: "Bán chạy nhất", href: "/trending" },
        { label: "Giảm giá", href: "/sale" },
        { label: "Bộ sưu tập", href: "/collections" },
        { label: "Xu hướng 2025", href: "/trends" },
      ],
    },
    {
      title: "Dịch vụ",
      links: [
        { label: "Hướng dẫn đặt hàng", href: "/guide" },
        { label: "Theo dõi đơn hàng", href: "/orders/track" },
        { label: "Chính sách đổi trả", href: "/refund" },
        { label: "Bảo hành sản phẩm", href: "/warranty" },
        { label: "Câu hỏi thường gặp", href: "/faq" },
      ],
    },
    {
      title: "Về chúng tôi",
      links: [
        { label: "Câu chuyện thương hiệu", href: "/about" },
        { label: "Hệ thống cửa hàng", href: "/stores" },
        { label: "Tuyển dụng", href: "/careers" },
        { label: "Blog thời trang", href: "/blog" },
        { label: "Liên hệ", href: "/contact" },
      ],
    },
  ];

  return (
    <footer className="relative mt-20 overflow-hidden bg-gradient-to-br from-slate-50 via-white to-violet-50">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-600 via-fuchsia-500 to-pink-500"></div>
      <div className="absolute -top-32 -right-32 w-64 h-64 bg-gradient-to-br from-violet-200 to-fuchsia-200 rounded-full blur-3xl opacity-30"></div>
      <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-gradient-to-br from-pink-200 to-violet-200 rounded-full blur-3xl opacity-30"></div>

      <div className="relative mx-auto max-w-7xl px-6 py-16">
        {/* Top section - Newsletter & Brand */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 mb-16">
          {/* Brand info */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-2xl blur-lg opacity-60"></div>
                <div className="relative bg-gradient-to-br from-violet-600 to-fuchsia-600 p-3 rounded-2xl">
                  <ShoppingBag size={28} className="text-white" strokeWidth={2.5} />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                  {brand}
                </h3>
                <p className="text-sm text-gray-600 font-medium">Modern Fashion for Everyone</p>
              </div>
            </div>

            <p className="text-gray-600 mb-6 leading-relaxed">
              Nơi phong cách gặp gỡ chất lượng. Khám phá bộ sưu tập thời trang hiện đại,
              độc đáo và luôn cập nhật xu hướng mới nhất.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-3">
              {[{
                Icon: Facebook,
                color: "from-blue-500 to-blue-600",
                href: "#",
              },
              {
                Icon: Instagram,
                color: "from-pink-500 to-purple-600",
                href: "#",
              },
              {
                Icon: Twitter,
                color: "from-sky-400 to-blue-500",
                href: "#",
              },
              {
                Icon: Youtube,
                color: "from-red-500 to-red-600",
                href: "#",
              },]
            .map(({ Icon, color, href }, idx) => (
                <a
                  key={idx}
                  href={href}
                  className={`group relative p-3 rounded-xl bg-white border border-gray-200 hover:border-transparent shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${color} rounded-xl opacity-0 group-hover:opacity-100 transition-opacity`}></div>
                  <Icon className="relative h-5 w-5 text-gray-600 group-hover:text-white transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div className="lg:pl-12">
            <div className="bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-3xl p-8 text-white shadow-2xl shadow-violet-500/30">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-6 w-6" />
                <h4 className="text-xl font-bold">Nhận ưu đãi đặc biệt</h4>
              </div>
              <p className="text-violet-100 mb-6">
                Đăng ký ngay để nhận mã giảm giá 15% cho đơn hàng đầu tiên và cập nhật xu hướng mới nhất!
              </p>

              <form onSubmit={onSubscribe} className="space-y-3">
                <div className="flex gap-2">
                  <div className="flex-1 flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/30 focus-within:bg-white/30 transition">
                    <Mail className="h-5 w-5 text-white/80" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="email@example.com"
                      className="flex-1 bg-transparent outline-none text-white placeholder:text-white/60"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-white text-violet-600 font-bold rounded-xl hover:bg-violet-50 hover:shadow-xl transition-all duration-200 hover:scale-105"
                  >
                    Đăng ký
                  </button>
                </div>
                {message && (
                  <p className="text-sm text-white bg-white/20 rounded-lg px-4 py-2 backdrop-blur-sm">
                    {message}
                  </p>
                )}
                {error && (
                  <p className="text-sm text-red-200 bg-red-500/20 rounded-lg px-4 py-2 backdrop-blur-sm">
                    {error}
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* Links sections */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-12">
          {sections.map((sec) => (
            <nav key={sec.title}>
              <h4 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">
                {sec.title}
              </h4>
              <ul className="space-y-3">
                {sec.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-gray-600 hover:text-violet-600 transition-colors text-sm font-medium hover:translate-x-1 inline-block duration-200"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          {/* Contact info */}
          <div className="col-span-2 md:col-span-3 lg:col-span-3 space-y-4">
            <h4 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">
              Liên hệ
            </h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-sm">
                <MapPin className="h-5 w-5 text-violet-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900">Cửa hàng chính</p>
                  <p className="text-gray-600">123 Nguyễn Trãi, Q.1, TP.HCM</p>
                </div>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <Phone className="h-5 w-5 text-violet-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900">Hotline</p>
                  <p className="text-gray-600">1900 0000 (8:00 - 22:00)</p>
                </div>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <Mail className="h-5 w-5 text-violet-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900">Email</p>
                  <p className="text-gray-600">support@shopstyle.vn</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment methods */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h5 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-violet-600" />
                Phương thức thanh toán
              </h5>
              <div className="flex flex-wrap gap-2">
                {["VISA", "Mastercard", "JCB", "VNPay", "Momo", "ZaloPay", "COD"].map((method) => (
                  <span
                    key={method}
                    className="px-3 py-1.5 bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 hover:shadow-md transition-shadow"
                  >
                    {method}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-2 border border-gray-200">
                <Globe className="h-4 w-4 text-gray-600" />
                <select className="bg-transparent outline-none text-sm font-medium text-gray-700">
                  <option>Tiếng Việt</option>
                  <option>English</option>
                </select>
              </div>
              <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-2 border border-gray-200">
                <TrendingUp className="h-4 w-4 text-gray-600" />
                <select className="bg-transparent outline-none text-sm font-medium text-gray-700">
                  <option>VND (₫)</option>
                  <option>USD ($)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-600 flex items-center gap-1">
              © {year} {brand}. Made with{" "}
              <Heart className="h-4 w-4 text-red-500 fill-red-500" /> in Vietnam
            </p>

            <div className="flex flex-wrap items-center gap-6">
              <Link href="/privacy" className="text-sm text-gray-600 hover:text-violet-600 transition">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-gray-600 hover:text-violet-600 transition">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-sm text-gray-600 hover:text-violet-600 transition">
                Cookie Policy
              </Link>
              <button
                onClick={scrollToTop}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-violet-500/30 transition-all duration-200 hover:-translate-y-0.5"
              >
                <ArrowUp className="h-4 w-4" />
                Lên đầu trang
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
