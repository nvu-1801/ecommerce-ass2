export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

import ProductForm from "@/components/ProductForm";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function EditProduct(
  props: { params: Promise<{ id: string }> } // 👈 params là Promise
) {
  const { id } = await props.params; // 👈 cần await
  const p = await prisma.product.findUnique({ where: { id } });
  if (!p) notFound();

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-semibold tracking-tight mb-6">
        Edit product
      </h1>
      <ProductForm
        id={p.id}
        defaultValues={{
          name: p.name,
          description: p.description,
          price: Number(p.price),
          image: p.image ?? "",
        }}
      />
    </div>
  );
}
