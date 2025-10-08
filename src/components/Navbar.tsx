// app/(main)/_components/Navbar.tsx
import Link from "next/link";
import { ShoppingBag, PlusCircle, UserRound } from "lucide-react";
import { supabaseServer } from "@/lib/supabase/supabase-server"; // chỉnh alias cho gọn
import NeedsLoginButton from "@/components/NeedsLoginButton";
import { redirect } from "next/navigation";

export default async function Navbar() {
  const sb = await supabaseServer();
  const {
    data: { user },
  } = await sb.auth.getUser();

  // 👇 Server Action: thực hiện signOut rồi redirect
  async function signOut() {
    "use server";
    const sb = await supabaseServer();
    await sb.auth.signOut();
    redirect("/signin"); // tuỳ đường dẫn trang đăng nhập của bạn
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/20 bg-gradient-to-r from-indigo-500/90 via-purple-500/90 to-pink-500/90 backdrop-blur-md text-white shadow-md">
      <nav className="max-w-6xl mx-auto h-14 px-4 flex items-center justify-between">
        {/* Logo & brand */}
        <Link href="/products" className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-white drop-shadow-sm" />
            <span className="font-semibold text-lg tracking-tight">
              Shop của <span className="font-bold text-yellow-300">Vũ</span>
            </span>
          </div>
        </Link>

        {/* Menu */}
        <div className="flex items-center gap-2">
          <Link
            href="/products"
            className="px-4 py-1.5 rounded-md text-sm font-medium hover:bg-white/15 transition-colors"
          >
            Sản phẩm
          </Link>

          {/* Nút Thêm mới — cần login */}
          {user ? (
            <Link
              href="/products/new"
              className="flex items-center gap-1 px-4 py-1.5 rounded-md text-sm font-medium bg-white text-purple-700 hover:bg-yellow-100 transition"
            >
              <PlusCircle size={16} />
              Thêm mới
            </Link>
          ) : (
            <NeedsLoginButton
              label="Thêm mới"
              className="flex items-center gap-1 px-4 py-1.5 rounded-md text-sm font-medium bg-white text-purple-700 hover:bg-yellow-100 transition"
              message="Bạn cần đăng nhập để tạo sản phẩm mới."
              goTo="/signin" // ✅ đồng bộ đường dẫn
            />
          )}

          {user ? (
            // ❗ Dùng form + server action thay cho Link
            <form action={signOut}>
              <button
                type="submit"
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-white/10 hover:bg-white/15 transition shadow"
              >
                <UserRound className="w-5 h-5" />
                <span className="hidden sm:inline">Đăng xuất</span>
              </button>
            </form>
          ) : (
            <Link
              href="/signin" // ✅ đồng bộ đường dẫn
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition shadow"
            >
              <UserRound className="w-5 h-5" />
              <span className="hidden sm:inline">Đăng nhập</span>
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
