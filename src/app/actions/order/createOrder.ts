// src/app/actions/createOrder.ts
"use server";

import { prisma } from "@/lib/prisma";
import type { CartItem } from "@/context/CartProvider";
import { Decimal } from "@prisma/client/runtime/library";
import { revalidatePath } from "next/cache";

export async function createOrder({
  userId,
  items,
  addressId,
  shippingMethod,
  shippingFee,
  paymentMethod,
  voucherCode,
  discount,
  note,
}: {
  userId: string;
  items: CartItem[];
  addressId: string;
  shippingMethod: string;
  shippingFee: number;
  paymentMethod: string;
  voucherCode?: string;
  discount: number;
  note?: string;
}) {
  try {
    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const total = subtotal + shippingFee - discount;

    const order = await prisma.order.create({
      data: {
        userId,
        addressId,
        orderNumber: `ORD${Date.now()}`,
        status: "PENDING",
        paymentMethod,
        paymentStatus: paymentMethod === "cod" ? "UNPAID" : "UNPAID",
        shippingMethod,
        shippingFee: new Decimal(shippingFee),
        subtotal: new Decimal(subtotal),
        discount: new Decimal(discount),
        total: new Decimal(total),
        voucherCode,
        note,
        items: {
          create: items.map((item) => ({
            productId: item.id,
            productName: item.name,
            productImage: item.image,
            price: new Decimal(item.price),
            quantity: item.quantity,
            subtotal: new Decimal(item.price * item.quantity),
          })),
        },
        statusHistory: {
          create: {
            status: "PENDING",
            note: "Đơn hàng đã được tạo",
          },
        },
      },
      include: {
        items: true,
        address: true,
      },
    });

    // Revalidate orders page
    revalidatePath("/orders");

    return { success: true, order };
  } catch (error) {
    console.error("Create order error:", error);
    return { success: false, error: "Failed to create order" };
  }
}
