export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ProductSchema } from "@/lib/validators";
import { ZodError } from "zod";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").trim();
  const page = Math.max(1, Number(searchParams.get("page") || 1));
  const limit = Math.max(1, Math.min(50, Number(searchParams.get("limit") || 12)));

  // ❗️không annotate kiểu, để TS infer
  const where = q
    ? { name: { contains: q, mode: "insensitive" as const } }
    : undefined; // để undefined thay vì {} cho gọn type

  const [total, data] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
  ]);

  return NextResponse.json({
    data,
    page,
    limit,
    total,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = ProductSchema.parse(body);
    const created = await prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        image: data.image ?? null,
      },
    });
    return NextResponse.json(created, { status: 201 });
  } catch (e: unknown) {
    if (e instanceof ZodError) {
      return NextResponse.json(
        { error: "ValidationError", details: e.flatten() },
        { status: 400 },
      );
    }
    return NextResponse.json({ error: "InternalServerError" }, { status: 500 });
  }
}
