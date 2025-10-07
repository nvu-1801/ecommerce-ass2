"use client";

import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProductSchema, type ProductInput } from "@/lib/validators";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ProductForm({
  defaultValues,
  id,
}: {
  defaultValues?: Partial<ProductInput>;
  id?: string;
}) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProductInput>({
    resolver: zodResolver(ProductSchema),
    defaultValues: (defaultValues ?? {}) as ProductInput,
  });

  const onSubmit: SubmitHandler<ProductInput> = async (values) => {
    const res = await fetch(id ? `/api/products/${id}` : "/api/products", {
      method: id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (res.ok) router.push("/products");
    else alert("Failed");
  };

  return (
    <div className="max-w-2xl">
      <div className="rounded-2xl border bg-white shadow-sm">
        <div className="border-b px-5 py-4">
          <h2 className="text-lg font-semibold">
            {id ? "Update product" : "Create new product"}
          </h2>
          <p className="text-sm text-zinc-600 mt-0.5">
            Điền thông tin sản phẩm quần áo của bạn
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-5">
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium">Name</label>
              <input
                className="w-full rounded-lg border px-3 py-2 outline-none ring-0 focus:ring-2 focus:ring-black/10"
                placeholder="Basic Tee"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium">Price (VND)</label>
              <input
                type="number"
                step="1000"
                className="w-full rounded-lg border px-3 py-2 outline-none ring-0 focus:ring-2 focus:ring-black/10"
                placeholder="199000"
                {...register("price", { valueAsNumber: true })}
              />
              {errors.price && (
                <p className="text-sm text-red-600">{errors.price.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium">Image URL</label>
            <input
              className="w-full rounded-lg border px-3 py-2 outline-none ring-0 focus:ring-2 focus:ring-black/10"
              placeholder="https://..."
              {...register("image")}
            />
            {errors.image && (
              <p className="text-sm text-red-600">{errors.image.message}</p>
            )}
            <p className="text-xs text-zinc-500">
              Gợi ý: dùng ảnh 800×1000 trở lên, tỉ lệ 4:5 để hiển thị đẹp.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium">Description</label>
            <textarea
              rows={5}
              className="w-full rounded-lg border px-3 py-2 outline-none ring-0 focus:ring-2 focus:ring-black/10"
              placeholder="100% cotton, form regular..."
              {...register("description")}
            />
            {errors.description && (
              <p className="text-sm text-red-600">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 pt-1">
            <Link
              href="/products"
              className="px-4 py-2 rounded-lg border hover:bg-zinc-50"
            >
              Cancel
            </Link>
            <button
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg bg-black text-white disabled:opacity-70"
            >
              {isSubmitting ? "Saving..." : id ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
