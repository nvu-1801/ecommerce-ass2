// components/ProductForm.tsx
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  Loader2,
  Check,
  ImageIcon,
  X,
  Upload,
  Sparkles,
  DollarSign,
} from "lucide-react";
import Link from "next/link";

const schema = z.object({
  name: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
  description: z.string().optional(),
  price: z.number("Giá phải là số").nonnegative("Giá không hợp lệ"),
  image: z.string().url("URL ảnh không hợp lệ").or(z.literal("")).optional(),
});

export type ProductFormValues = z.infer<typeof schema>;

export default function ProductForm({
  id,
  defaultValues,
}: {
  id?: string;
  defaultValues?: ProductFormValues;
}) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      description: defaultValues?.description ?? "",
      price: defaultValues?.price ?? 0,
      image: defaultValues?.image ?? "",
    },
  });

  const imageUrl = watch("image");
  const price = watch("price");

  const formatVND = (n: number) =>
    Number(n ?? 0).toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });

  async function onSubmit(values: ProductFormValues) {
    const payload = {
      name: values.name.trim(),
      description: values.description?.trim() ?? "",
      price: Number(values.price),
      image: values.image?.trim() || null,
    };

    const endpoint = id ? `/api/products/${id}` : `/api/products`;
    const method = id ? "PUT" : "POST";

    const res = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || "Failed to save product");
    }

    if (id) {
      router.push(`/products/${id}`);
    } else {
      router.push(`/products`);
    }
    router.refresh();
  }

  function handlePriceChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/[^\d.]/g, "");
    const num = Number(raw || 0);
    setValue("price", num, { shouldDirty: true, shouldValidate: true });
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
            {id ? "Chỉnh sửa sản phẩm" : "Tạo sản phẩm mới"}
          </h2>
        </div>
        <p className="text-gray-600 text-sm ml-14">
          {id
            ? "Cập nhật thông tin sản phẩm của bạn"
            : "Thêm sản phẩm mới vào cửa hàng"}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 space-y-6">
          {/* Name */}
          <div className="group">
            <label className="block text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
              Tên sản phẩm
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100 outline-none transition-all duration-200"
              placeholder="Ví dụ: Áo thun cổ tròn basic"
              {...register("name")}
            />
            {errors.name && (
              <div className="mt-2 flex items-center gap-2 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                <span className="h-1.5 w-1.5 rounded-full bg-red-600"></span>
                {errors.name.message}
              </div>
            )}
          </div>

          {/* Description */}
          <div className="group">
            <label className="block text-sm font-bold text-gray-900 mb-2">
              Mô tả sản phẩm
            </label>
            <textarea
              rows={5}
              className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100 outline-none transition-all duration-200 resize-none"
              placeholder="Chất liệu, size, hướng dẫn giặt, ưu điểm nổi bật..."
              {...register("description")}
            />
            {errors.description && (
              <div className="mt-2 flex items-center gap-2 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                <span className="h-1.5 w-1.5 rounded-full bg-red-600"></span>
                {errors.description.message}
              </div>
            )}
          </div>

          {/* Price */}
          <div className="group">
            <label className="block text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-violet-600" />
              Giá bán
              <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                inputMode="decimal"
                placeholder="199000"
                className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-3 pr-16 text-gray-900 placeholder:text-gray-400 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100 outline-none transition-all duration-200"
                defaultValue={defaultValues?.price ?? 0}
                onChange={handlePriceChange}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-500">
                VND
              </div>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <div className="px-3 py-1.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-lg">
                <span className="text-sm font-bold text-white">
                  {formatVND(Number(price || 0))}
                </span>
              </div>
            </div>
            {errors.price && (
              <div className="mt-2 flex items-center gap-2 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                <span className="h-1.5 w-1.5 rounded-full bg-red-600"></span>
                {errors.price.message}
              </div>
            )}
          </div>
        </div>

        {/* Image Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <div className="flex items-center gap-2 mb-4">
            <Upload className="h-5 w-5 text-violet-600" />
            <label className="block text-sm font-bold text-gray-900">
              Hình ảnh sản phẩm
            </label>
          </div>

          <input
            type="url"
            placeholder="https://example.com/image.jpg"
            className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100 outline-none transition-all duration-200"
            {...register("image")}
          />
          {errors.image && (
            <div className="mt-2 flex items-center gap-2 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
              <span className="h-1.5 w-1.5 rounded-full bg-red-600"></span>
              {errors.image.message}
            </div>
          )}

          {/* Preview */}
          <div className="mt-6">
            <p className="text-sm font-semibold text-gray-700 mb-3">
              Xem trước:
            </p>
            <div className="relative aspect-[4/5] w-full max-w-sm overflow-hidden rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-dashed border-gray-300">
              {imageUrl ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="h-full w-full object-cover"
                    onError={() => {
                      setValue("image", "", { shouldDirty: true });
                    }}
                  />
                  <div className="absolute top-3 right-3">
                    <div className="px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg">
                      <Check className="h-4 w-4 text-green-600" />
                    </div>
                  </div>
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                  <div className="p-4 rounded-2xl bg-gray-200/50 mb-3">
                    <ImageIcon className="h-12 w-12" />
                  </div>
                  <span className="text-sm font-medium">
                    Dán URL ảnh để xem trước
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-3 text-white text-sm font-bold shadow-lg shadow-violet-500/30 hover:shadow-xl hover:shadow-violet-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:-translate-y-0.5"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Đang lưu...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  {id ? "Cập nhật" : "Tạo sản phẩm"}
                </>
              )}
            </button>

            <Link
              href={id ? `/products/${id}` : `/products`}
              className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
            >
              <X className="h-4 w-4" />
              Huỷ
            </Link>
          </div>

          {isDirty && (
            <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-xl">
              <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse"></span>
              <span className="text-xs font-medium text-amber-700">
                Có thay đổi chưa lưu
              </span>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
