import Image from "next/image";
import { ShoppingBag, Sparkles, TrendingUp, Shield, Zap } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh grid grid-cols-1 lg:grid-cols-2 bg-gradient-to-br from-slate-50 via-white to-violet-50">
      {/* Left panel (form) */}
      <div className="flex items-center justify-center p-6 lg:p-12 relative">
        {/* Decorative blur elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-violet-200 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-fuchsia-200 rounded-full blur-3xl opacity-20 animate-pulse delay-1000"></div>

        <div className="w-full max-w-md relative z-10">{children}</div>
      </div>

      {/* Right hero */}
      <div className="hidden lg:flex relative bg-gradient-to-br from-violet-600 via-fuchsia-600 to-pink-600 overflow-hidden">
        {/* Pattern overlay */}
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>

        {/* Image with overlay */}
        <div className="relative w-full h-full">
          <Image
            src="/hero.png"
            alt="Hero"
            fill
            className="object-cover opacity-40 mix-blend-overlay"
            priority
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-violet-600/80 via-fuchsia-600/80 to-pink-600/80"></div>
        </div>

        {/* Content overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-white z-10">
          {/* Brand */}
          <div className="mb-12 text-center">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="p-4 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30">
                <ShoppingBag
                  size={40}
                  className="text-white"
                  strokeWidth={2.5}
                />
              </div>
            </div>
            <h2 className="text-4xl font-bold mb-3">ShopStyle</h2>
            <p className="text-white/90 text-lg font-medium">
              Nền tảng mua sắm hiện đại
            </p>
          </div>

          {/* Features */}
          <div className="max-w-md space-y-6">
            {[
              {
                icon: Sparkles,
                title: "Sản phẩm chất lượng",
                desc: "Hàng ngàn sản phẩm thời trang được tuyển chọn",
              },
              {
                icon: TrendingUp,
                title: "Xu hướng mới nhất",
                desc: "Cập nhật liên tục các mẫu mới và hot trend",
              },
              {
                icon: Shield,
                title: "Mua sắm an toàn",
                desc: "Bảo mật thông tin và giao dịch tuyệt đối",
              },
              {
                icon: Zap,
                title: "Giao hàng nhanh",
                desc: "Vận chuyển toàn quốc trong 2-3 ngày",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="flex items-start gap-4 p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 group"
              >
                <div className="flex-shrink-0 p-3 rounded-xl bg-white/20 border border-white/30 group-hover:scale-110 transition-transform">
                  <feature.icon
                    className="h-6 w-6 text-white"
                    strokeWidth={2.5}
                  />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">{feature.title}</h3>
                  <p className="text-white/80 text-sm leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-3 gap-6 w-full max-w-md">
            {[
              { value: "10K+", label: "Sản phẩm" },
              { value: "50K+", label: "Khách hàng" },
              { value: "4.9★", label: "Đánh giá" },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="text-center p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20"
              >
                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                <div className="text-white/70 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Floating elements */}
        <div className="absolute top-10 right-10 w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 animate-bounce"></div>
        <div className="absolute bottom-20 left-10 w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 animate-pulse"></div>
      </div>
    </div>
  );
}
