// app/api/health/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // thay vì SELECT 1 với $queryRaw`SELECT 1` (Prisma >=5 dùng prisma.$queryRaw`SELECT 1`)
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    // Trả chi tiết để debug (DEV mới nên giữ vậy)
    return NextResponse.json(
      {
        ok: false,
        name: e?.name,
        code: e?.code,
        message: e?.message,
        stack: e?.stack?.split("\n").slice(0, 5).join("\n"),
      },
      { status: 500 },
    );
  }
}
