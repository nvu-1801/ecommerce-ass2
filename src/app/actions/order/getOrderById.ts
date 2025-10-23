// src/app/actions/getOrderById.ts
"use server";

import { prisma } from "@/lib/prisma";

export async function getOrderById(orderId: string, userId: string) {
  try {
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId, // Security: chỉ lấy order của user hiện tại
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        address: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        statusHistory: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!order) return null;

    // Convert Decimal to number
    return {
      ...order,
      total: Number(order.total),
      subtotal: Number(order.subtotal),
      discount: Number(order.discount),
      shippingFee: Number(order.shippingFee),
      items: order.items.map((item) => ({
        ...item,
        price: Number(item.price),
        subtotal: Number(item.subtotal),
      })),
    };
  } catch (error) {
    console.error("Get order by id error:", error);
    return null;
  }
}
