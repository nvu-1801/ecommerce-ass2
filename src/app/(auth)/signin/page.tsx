import AuthTabs from "@/components/auth/AuthTabs";
import AuthForm from "@/components/auth/AuthForm";
import { supabaseServer } from "@/lib/supabase/supabase-server";
import { cookies } from "next/headers";
import { CheckCircle2, AlertCircle, Sparkles, ShoppingBag } from "lucide-react";

type Props = {
  searchParams: Promise<{
    registered?: string;
    error?: string;
    redirect?: string;
  }>;
};

export default async function SignInPage({ searchParams }: Props) {
  const sp = await searchParams;
  const justRegistered = sp.registered === "1";
  const err = sp.error ?? null;

  // Clear any invalid sessions
  try {
    const supabase = await supabaseServer();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      // Clear cookies if no valid session
      const cookieStore = await cookies();
      cookieStore.delete("sb-access-token");
      cookieStore.delete("sb-refresh-token");
    }
  } catch (error) {
    // Silently handle errors
    console.error("Session check error:", error);
  }

  return (
    <div className="w-full">
      {/* Brand Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center mb-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-2xl blur-lg opacity-60 animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-violet-600 to-fuchsia-600 p-4 rounded-2xl">
              <ShoppingBag size={32} className="text-white" strokeWidth={2.5} />
            </div>
          </div>
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent mb-2">
          Chào mừng trở lại
        </h1>
        <p className="text-gray-600 text-sm font-medium flex items-center justify-center gap-2">
          <Sparkles className="h-4 w-4 text-violet-600" />
          Đăng nhập để tiếp tục mua sắm
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <AuthTabs />
      </div>

      {/* Success Message */}
      {justRegistered && (
        <div className="mb-6 rounded-xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50 p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-emerald-900 mb-1">
                Tạo tài khoản thành công!
              </h3>
              <p className="text-sm text-emerald-700">
                Vui lòng đăng nhập để tiếp tục trải nghiệm mua sắm.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {err && (
        <div className="mb-6 rounded-xl border-2 border-red-200 bg-gradient-to-br from-red-50 to-pink-50 p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-red-900 mb-1">
                Đã có lỗi xảy ra
              </h3>
              <p className="text-sm text-red-700">{err}</p>
            </div>
          </div>
        </div>
      )}

      {/* Auth Form */}
      <div className="bg-white rounded-2xl border-2 border-gray-100 shadow-lg p-8">
        <AuthForm mode="signin" />
      </div>

      {/* Footer Text */}
      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500 leading-relaxed">
          Bằng việc tiếp tục, bạn đồng ý với{" "}
          <a
            href="/terms"
            className="text-violet-600 hover:text-violet-700 font-semibold hover:underline transition-colors"
          >
            Điều khoản dịch vụ
          </a>{" "}
          và{" "}
          <a
            href="/privacy"
            className="text-violet-600 hover:text-violet-700 font-semibold hover:underline transition-colors"
          >
            Chính sách bảo mật
          </a>{" "}
          của chúng tôi.
        </p>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-violet-200 to-fuchsia-200 rounded-full blur-3xl opacity-20 -z-10"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-br from-pink-200 to-violet-200 rounded-full blur-3xl opacity-20 -z-10"></div>
    </div>
  );
}
