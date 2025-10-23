// src/app/actions/cancelOrder.ts
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function cancelOrder(
  orderId: string,
  userId: string,
  reason?: string
) {
  try {
    // Verify order belongs to user và có thể cancel
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId,
        status: {
          in: ["PENDING", "CONFIRMED"], // Chỉ cancel được khi đang chờ/đã xác nhận
        },
      },
    });

    if (!order) {
      return { success: false, error: "Không thể hủy đơn hàng này" };
    }

    // Update order status
    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: "CANCELLED",
        cancelledAt: new Date(),
        statusHistory: {
          create: {
            status: "CANCELLED",
            note: reason || "Khách hàng hủy đơn",
          },
        },
      },
    });

    revalidatePath("/orders");
    revalidatePath(`/orders/${orderId}`);

    return { success: true };
  } catch (error) {
    console.error("Cancel order error:", error);
    return { success: false, error: "Đã có lỗi xảy ra" };
  }
}
