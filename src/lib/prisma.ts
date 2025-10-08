// src/lib/prisma.ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

const isRender = !!process.env.RENDER;
const isVercel = !!process.env.VERCEL;

const runtimeUrl =
  (isVercel && process.env.POOLER_DATABASE_URL) ||
  (isRender && process.env.DIRECT_DATABASE_URL) ||
  process.env.DATABASE_URL; // fallback

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: { db: { url: runtimeUrl } },
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });
