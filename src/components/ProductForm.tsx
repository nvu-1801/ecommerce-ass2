// components/ProductForm.tsx
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Loader2, Check, ImageIcon, X } from "lucide-react";
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

  // Hiển thị giá VND ở dưới input
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

    // Điều hướng về chi tiết hoặc list
    if (id) {
      router.push(`/products/${id}`);
    } else {
      router.push(`/products`);
    }
    router.refresh();
  }

  // Chuyển giá từ input text -> number (chấp nhận chỉ số & dấu phẩy/chấm)
  function handlePriceChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/[^\d.]/g, "");
    const num = Number(raw || 0);
    setValue("price", num, { shouldDirty: true, shouldValidate: true });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-zinc-800">
          Tên sản phẩm <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          className="mt-2 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-zinc-900 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
          placeholder="Ví dụ: Áo thun cổ tròn basic"
          {...register("name")}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-zinc-800">Mô tả</label>
        <textarea
          rows={5}
          className="mt-2 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-zinc-900 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
          placeholder="Chất liệu, size, hướng dẫn giặt, ưu điểm nổi bật..."
          {...register("description")}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Price */}
      <div>
        <label className="block text-sm font-medium text-zinc-800">
          Giá (VND) <span className="text-red-500">*</span>
        </label>
        <input
          inputMode="decimal"
          placeholder="vd: 199000"
          className="mt-2 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-zinc-900 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
          defaultValue={defaultValues?.price ?? 0}
          onChange={handlePriceChange}
        />
        <div className="mt-1 text-sm text-zinc-500">
          {formatVND(Number(price || 0))}
        </div>
        {errors.price && (
          <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
        )}
      </div>

      {/* Image URL + Preview */}
      <div>
        <label className="block text-sm font-medium text-zinc-800">
          Ảnh (URL)
        </label>
        <input
          type="url"
          placeholder="https://..."
          className="mt-2 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-zinc-900 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
          {...register("image")}
        />
        {errors.image && (
          <p className="mt-1 text-sm text-red-600">{errors.image.message}</p>
        )}

        <div className="mt-3 rounded-2xl border border-dashed border-zinc-300 p-3">
          <p className="text-sm text-zinc-600 mb-2">Xem trước:</p>
          <div className="aspect-[4/5] w-full overflow-hidden rounded-2xl bg-zinc-100 grid place-items-center">
            {imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imageUrl}
                alt="Preview"
                className="h-full w-full object-cover"
                onError={() => {
                  // lỗi ảnh -> xoá để hiện fallback
                  setValue("image", "", { shouldDirty: true });
                }}
              />
            ) : (
              <div className="flex flex-col items-center text-zinc-400">
                <ImageIcon className="h-10 w-10 mb-2" />
                <span className="text-sm">Dán URL ảnh để preview</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-fuchsia-500 px-4 py-2.5 text-white text-sm font-medium shadow-lg hover:opacity-95 disabled:opacity-70"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Check className="h-4 w-4" />
              Save changes
            </>
          )}
        </button>

        <Link
          href={id ? `/products/${id}` : `/products`}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 shadow-sm hover:bg-zinc-50"
        >
          <X className="h-4 w-4" />
          Cancel
        </Link>

        {!isDirty && (
          <span className="text-xs text-zinc-500">Không có thay đổi nào.</span>
        )}
      </div>
    </form>
  );
}
