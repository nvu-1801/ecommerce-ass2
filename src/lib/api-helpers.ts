// app/api/health/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    console.log("DB URL @runtime:", process.env.DATABASE_URL);
    console.log("DB HOST @runtime:", new URL(process.env.DATABASE_URL!).host);
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, name: e?.name, code: e?.code, message: e?.message },
      { status: 500 }
    );
  }
}
