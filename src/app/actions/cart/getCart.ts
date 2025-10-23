// src/app/actions/cart/getCart.ts
"use server";

import { prisma } from "@/lib/prisma";

export async function getCart(userId: string, sessionId?: string) {
  try {
    const cart = await prisma.cart.findFirst({
      where: userId ? { userId } : { sessionId },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                image: true,
              },
            },
          },
        },
      },
    });

    if (!cart) return null;

    // Convert to CartItem format
    return {
      id: cart.id,
      items: cart.items.map((item) => ({
        id: item.product.id,
        name: item.product.name,
        price: Number(item.product.price),
        image: item.product.image,
        quantity: item.quantity,
        cartItemId: item.id, // ID của CartItem trong DB
      })),
    };
  } catch (error) {
    console.error("Get cart error:", error);
    return null;
  }
}
