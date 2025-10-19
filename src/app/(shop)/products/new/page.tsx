export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

import ProductForm from "@/components/ProductForm";
export default function NewProductPage() {
  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Create product</h1>
      <ProductForm />
    </div>
  );
}
