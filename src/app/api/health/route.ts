// app/api/health/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs"; // dùng Prisma ở Node runtime

export async function GET() {
  try {
    // Ping DB (Prisma 5+): raw template tag
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({
      ok: true,
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
