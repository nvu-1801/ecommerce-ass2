// actions/updateOrderStatus.ts
"use server";

import { prisma } from "@/lib/prisma";
import { Prisma, OrderStatus } from "@prisma/client";

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
  note?: string
) {
  // Map trạng thái -> field timestamp tương ứng
  const statusToField: Record<OrderStatus, keyof Prisma.OrderUncheckedUpdateInput | null> = {
    [OrderStatus.PENDING]:    null,
    [OrderStatus.CONFIRMED]:  null,
    [OrderStatus.PROCESSING]: null,
    [OrderStatus.SHIPPING]:   "shippedAt",
    [OrderStatus.DELIVERED]:  "deliveredAt",
    [OrderStatus.COMPLETED]:  null,
    [OrderStatus.CANCELLED]:  "cancelledAt",
    [OrderStatus.REFUNDED]:   null,
  };

  const tsField = statusToField[status];
  const timestampPatch: Record<string, Date> = tsField ? { [tsField]: new Date() } : {};

  const order = await prisma.order.update({
    where: { id: orderId },
    data: {
      status,                           // ✅ enum thật: OrderStatus.*
      ...timestampPatch,                // ✅ chỉ set đúng field timestamp
      statusHistory: {
        create: {                       // ✅ nested create log trạng thái
          status,
          note,
        },
      },
    },
    include: {
      statusHistory: { orderBy: { createdAt: "desc" } },
    },
  });

  return order;
}
