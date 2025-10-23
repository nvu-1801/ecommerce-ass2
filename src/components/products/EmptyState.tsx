import Link from "next/link";
import { Sparkles, X, Plus } from "lucide-react";
import NeedsLoginButton from "@/components/NeedsLoginButton";

export default function EmptyState({
  q,
  hasActiveFilters,
  isAuthed,
}: {
  q?: string;
  hasActiveFilters: boolean;
  isAuthed: boolean;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-16 text-center">
      <div className="inline-flex p-6 rounded-3xl bg-gradient-to-br from-violet-100 to-fuchsia-100 mb-6">
        <Sparkles className="h-12 w-12 text-violet-600" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Không tìm thấy sản phẩm
      </h2>
      <p className="text-gray-600 mb-8">
        {q || hasActiveFilters
          ? "Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm."
          : "Hãy tạo sản phẩm đầu tiên để bắt đầu bán hàng."}
      </p>
      <div className="flex justify-center gap-3">
        {(q || hasActiveFilters) && (
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-gray-200 bg-white text-gray-700 font-semibold hover:bg-gray-50 transition-all duration-200"
          >
            <X className="h-4 w-4" /> Xóa bộ lọc
          </Link>
        )}
        {isAuthed ? (
          <Link
            href="/products/new"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold hover:from-violet-700 hover:to-fuchsia-700 shadow-lg shadow-violet-500/30 transition-all duration-200"
          >
            <Plus className="h-5 w-5" /> Tạo sản phẩm
          </Link>
        ) : (
          <NeedsLoginButton
            label="Tạo sản phẩm"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold hover:from-violet-700 hover:to-fuchsia-700 shadow-lg shadow-violet-500/30 transition-all duration-200"
            message="Bạn cần đăng nhập để tạo sản phẩm mới."
            goTo="/signin"
          />
        )}
      </div>
    </div>
  );
}
