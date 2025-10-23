// src/app/actions/cart/addToCart.ts
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addToCart({
  userId,
  sessionId,
  productId,
  quantity = 1,
}: {
  userId?: string;
  sessionId?: string;
  productId: string;
  quantity?: number;
}) {
  try {
    // Find or create cart
    let cart = await prisma.cart.findFirst({
      where: userId ? { userId } : { sessionId },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId: userId || null,
          sessionId: sessionId || null,
        },
      });
    }

    // Check if product already in cart
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
    });

    if (existingItem) {
      // Update quantity
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    } else {
      // Create new cart item
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
        },
      });
    }

    revalidatePath("/cart");
    return { success: true, cartId: cart.id };
  } catch (error) {
    console.error("Add to cart error:", error);
    return { success: false, error: "Failed to add to cart" };
  }
}
