// src/app/actions/getOrders.ts
"use server";

import { prisma } from "@/lib/prisma";

export async function getOrders(userId: string) {
  try {
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
        address: true,
        statusHistory: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Convert Decimal to number for client component
    return orders.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      shippingMethod: order.shippingMethod,
      total: Number(order.total),
      subtotal: Number(order.subtotal),
      discount: Number(order.discount),
      shippingFee: Number(order.shippingFee),
      voucherCode: order.voucherCode,
      note: order.note,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      paidAt: order.paidAt,
      shippedAt: order.shippedAt,
      deliveredAt: order.deliveredAt,
      cancelledAt: order.cancelledAt,
      items: order.items.map((item) => ({
        id: item.id,
        productId: item.productId,
        productName: item.productName,
        productImage: item.productImage,
        price: Number(item.price),
        quantity: item.quantity,
        subtotal: Number(item.subtotal),
        createdAt: item.createdAt,
      })),
      address: {
        id: order.address.id,
        name: order.address.name,
        fullName: order.address.fullName,
        phone: order.address.phone,
        address: order.address.address,
        isDefault: order.address.isDefault,
      },
      statusHistory: order.statusHistory,
    }));
  } catch (error) {
    console.error("Get orders error:", error);
    return [];
  }
}
