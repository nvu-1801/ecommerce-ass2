// src/app/actions/cart/clearCart.ts
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function clearCart(cartId: string) {
  try {
    await prisma.cartItem.deleteMany({
      where: { cartId },
    });

    revalidatePath("/cart");
    return { success: true };
  } catch (error) {
    console.error("Clear cart error:", error);
    return { success: false, error: "Failed to clear cart" };
  }
}
