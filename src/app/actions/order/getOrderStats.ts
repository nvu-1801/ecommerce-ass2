// src/app/actions/getOrderStats.ts
"use server";

import { prisma } from "@/lib/prisma";

export async function getOrderStats(userId: string) {
  try {
    const [
      totalOrders,
      pendingOrders,
      shippingOrders,
      completedOrders,
      totalSpent,
    ] = await Promise.all([
      prisma.order.count({ where: { userId } }),
      prisma.order.count({ where: { userId, status: "PENDING" } }),
      prisma.order.count({ where: { userId, status: "SHIPPING" } }),
      prisma.order.count({ where: { userId, status: "COMPLETED" } }),
      prisma.order.aggregate({
        where: { userId, status: { not: "CANCELLED" } },
        _sum: { total: true },
      }),
    ]);

    return {
      totalOrders,
      pendingOrders,
      shippingOrders,
      completedOrders,
      totalSpent: Number(totalSpent._sum.total || 0),
    };
  } catch (error) {
    console.error("Get order stats error:", error);
    return {
      totalOrders: 0,
      pendingOrders: 0,
      shippingOrders: 0,
      completedOrders: 0,
      totalSpent: 0,
    };
  }
}
