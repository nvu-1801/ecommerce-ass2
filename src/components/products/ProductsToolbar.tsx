import Link from "next/link";
import { Search, Plus, X, SlidersHorizontal, ChevronDown } from "lucide-react";
import NeedsLoginButton from "@/components/NeedsLoginButton";

export default function ProductsToolbar({
  q,
  sort,
  minPrice,
  maxPrice,
  dateFilter,
  isAuthed,
  hasActiveFilters,
}: {
  q?: string;
  sort?: string;
  minPrice?: number | undefined;
  maxPrice?: number | undefined;
  dateFilter?: string;
  isAuthed: boolean;
  hasActiveFilters: boolean;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
      <form action="/products" className="space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder="Tìm kiếm sản phẩm theo tên..."
              className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 pl-12 pr-4 py-3 outline-none focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100 transition-all duration-200"
            />
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold hover:from-violet-700 hover:to-fuchsia-700 shadow-lg shadow-violet-500/30 hover:shadow-xl hover:shadow-violet-500/40 transition-all duration-200 hover:-translate-y-0.5"
            >
              Tìm kiếm
            </button>
            {(q || hasActiveFilters) && (
              <Link
                href="/products"
                className="px-6 py-3 rounded-xl border-2 border-gray-200 bg-white text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Xóa bộ lọc
              </Link>
            )}
            {isAuthed ? (
              <Link
                href="/products/new"
                className="px-6 py-3 rounded-xl bg-black text-white font-semibold hover:bg-gray-900 shadow-lg shadow-black/10 hover:shadow-xl hover:shadow-black/20 transition-all duration-200 hover:-translate-y-0.5 flex items-center gap-2"
              >
                <Plus className="h-5 w-5" strokeWidth={2.5} />
                <span className="hidden sm:inline">Thêm mới</span>
              </Link>
            ) : (
              <NeedsLoginButton
                label="Thêm mới"
                className="px-6 py-3 rounded-xl bg-black text-white font-semibold hover:bg-gray-900 shadow-lg shadow-black/10 hover:shadow-xl hover-black/20 transition-all duration-200 flex items-center gap-2"
                message="Bạn cần đăng nhập để tạo sản phẩm mới."
                goTo="/signin"
              />
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-4 border-t border-gray-100">
          <div className="relative">
            <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Sắp xếp
            </label>
            <div className="relative">
              <select
                name="sort"
                defaultValue={sort}
                className="w-full rounded-lg border-2 border-gray-200 bg-gray-50 px-3 py-2 pr-8 text-sm font-medium outline-none focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100 transition-all duration-200 appearance-none cursor-pointer"
              >
                <option value="newest">Mới nhất</option>
                <option value="oldest">Cũ nhất</option>
                <option value="price-asc">Giá thấp → cao</option>
                <option value="price-desc">Giá cao → thấp</option>
                <option value="name">Tên A → Z</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Giá từ (VND)
            </label>
            <input
              type="number"
              name="minPrice"
              defaultValue={minPrice ?? ""}
              placeholder="0"
              min="0"
              step="1000"
              className="w-full rounded-lg border-2 border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium outline-none focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100 transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Giá đến (VND)
            </label>
            <input
              type="number"
              name="maxPrice"
              defaultValue={maxPrice ?? ""}
              placeholder="Không giới hạn"
              min="0"
              step="1000"
              className="w-full rounded-lg border-2 border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium outline-none focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100 transition-all duration-200"
            />
          </div>

          <div className="relative">
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Ngày tạo
            </label>
            <div className="relative">
              <select
                name="dateFilter"
                defaultValue={dateFilter}
                className="w-full rounded-lg border-2 border-gray-200 bg-gray-50 px-3 py-2 pr-8 text-sm font-medium outline-none focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100 transition-all duration-200 appearance-none cursor-pointer"
              >
                <option value="all">Tất cả</option>
                <option value="today">Hôm nay</option>
                <option value="week">7 ngày qua</option>
                <option value="month">30 ngày qua</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
