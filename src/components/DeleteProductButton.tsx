"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteProductButton({ id }: { id: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function onDelete() {
    if (!confirm("Delete this product?")) return;
    setPending(true);
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (res.ok) router.push("/products");
    else {
      setPending(false);
      alert("Delete failed");
    }
  }

  return (
<button
  onClick={onDelete}
  disabled={pending}
  className="px-3 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-70"
>
  {pending ? "Deleting..." : "Delete"}
</button>
  );
}
