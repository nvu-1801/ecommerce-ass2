export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    console.error("HEALTH ERROR:", e); // xem ở Vercel → Functions logs
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
