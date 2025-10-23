// src/app/actions/cart/updateCartItem.ts
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateCartItem({
  cartItemId,
  quantity,
}: {
  cartItemId: string;
  quantity: number;
}) {
  try {
    if (quantity <= 0) {
      // Remove item if quantity is 0
      await prisma.cartItem.delete({
        where: { id: cartItemId },
      });
    } else {
      // Update quantity
      await prisma.cartItem.update({
        where: { id: cartItemId },
        data: { quantity },
      });
    }

    revalidatePath("/cart");
    return { success: true };
  } catch (error) {
    console.error("Update cart item error:", error);
    return { success: false, error: "Failed to update cart item" };
  }
}
