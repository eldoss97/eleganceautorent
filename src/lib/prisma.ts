// src/lib/prisma.ts
import { PrismaClient } from "@prisma/client";

declare global {
  // чтобы TypeScript не ругался на global.prisma
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "warn", "error"] : ["warn", "error"],
    errorFormat: "pretty",
  });

// в проде создаём один инстанс на процесс, в dev кешируем на global
if (process.env.NODE_ENV !== "production") global.prisma = prisma;
