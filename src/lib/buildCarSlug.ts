import { prisma } from "@/lib/prisma";
import slugify from "@/lib/slugify";

type In = { title?: string; brand?: string; model?: string };

export async function buildCarSlug(input: In, skipId?: number): Promise<string> {
  const baseText =
    (input.title ?? "").trim() ||
    `${input.brand ?? ""} ${input.model ?? ""}`.trim() ||
    "car";

  const base = slugify(baseText) || "car";
  let slug = base;
  let i = 2;

  while (true) {
    const exists = await prisma.car.findFirst({
      where: { slug, ...(skipId ? { NOT: { id: skipId } } : {}) },
      select: { id: true },
    });
    if (!exists) break;
    slug = `${base}-${i++}`;
  }

  return slug;
}
