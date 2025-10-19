// app/(main)/_components/Navbar.tsx
import Link from "next/link";
import {
  ShoppingBag,
  PlusCircle,
  UserRound,
  LogOut,
  Sparkles,
} from "lucide-react";
import { supabaseServer } from "@/lib/supabase/supabase-server";
import NeedsLoginButton from "@/components/NeedsLoginButton";
import { redirect } from "next/navigation";

export default async function Navbar() {
  const sb = await supabaseServer();
  const {
    data: { user },
  } = await sb.auth.getUser();

  async function signOut() {
    "use server";
    const sb = await supabaseServer();
    await sb.auth.signOut();
    redirect("/signin");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-xl shadow-sm">
      <nav className="max-w-7xl mx-auto h-16 px-6 flex items-center justify-between">
        {/* Logo & brand */}
        <Link
          href="/products"
          className="group flex items-center gap-3 transition-transform hover:scale-105"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl blur-sm opacity-75 group-hover:opacity-100 transition"></div>
            <div className="relative bg-gradient-to-br from-violet-600 to-fuchsia-600 p-2 rounded-xl">
              <ShoppingBag size={24} className="text-white" strokeWidth={2.5} />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
              ShopStyle
            </span>
            <span className="text-xs text-gray-500 font-medium">
              Modern Fashion
            </span>
          </div>
        </Link>

        {/* Menu */}
        <div className="flex items-center gap-3">
          <Link
            href="/products"
            className="group px-5 py-2 rounded-xl text-sm font-semibold text-gray-700 hover:text-violet-600 hover:bg-violet-50 transition-all duration-200"
          >
            <span className="flex items-center gap-2">
              <Sparkles
                size={16}
                className="opacity-0 group-hover:opacity-100 transition"
              />
              Sản phẩm
            </span>
          </Link>

          {/* Nút Thêm mới */}
          {user ? (
            <Link
              href="/products/new"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 shadow-lg shadow-violet-500/30 hover:shadow-xl hover:shadow-violet-500/40 transition-all duration-200 hover:-translate-y-0.5"
            >
              <PlusCircle size={18} strokeWidth={2.5} />
              Thêm mới
            </Link>
          ) : (
            <NeedsLoginButton
              label="Thêm mới"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 shadow-lg shadow-violet-500/30 hover:shadow-xl hover:shadow-violet-500/40 transition-all duration-200"
              message="Bạn cần đăng nhập để tạo sản phẩm mới."
              goTo="/signin"
            />
          )}

          {user ? (
            <form action={signOut}>
              <button
                type="submit"
                className="group flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-red-50 hover:text-red-600 border border-gray-200 hover:border-red-200 transition-all duration-200"
              >
                <LogOut className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                <span className="hidden sm:inline">Đăng xuất</span>
              </button>
            </form>
          ) : (
            <Link
              href="/signin"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-violet-600 bg-violet-50 hover:bg-violet-100 border-2 border-violet-200 hover:border-violet-300 transition-all duration-200 hover:shadow-md"
            >
              <UserRound className="w-4 h-4" strokeWidth={2.5} />
              <span className="hidden sm:inline">Đăng nhập</span>
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
